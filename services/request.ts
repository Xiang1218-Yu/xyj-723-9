import { getConfig } from '../config/index';
import { REQUEST_DEFAULTS } from '../constants/index';
import type {
  RequestOptions,
  RequestInterceptor,
  ResponseInterceptor,
  RequestError,
  ApiResponse,
} from '../types/api';

const config = getConfig();

let performanceTracker: {
  trackRequest?: (url: string, duration: number, success: boolean) => void;
} | null = null;

let errorReporter: {
  report?: (err: RequestError) => void;
} | null = null;

export function setPerformanceTracker(tracker: typeof performanceTracker): void {
  performanceTracker = tracker;
}

export function setErrorReporter(reporter: typeof errorReporter): void {
  errorReporter = reporter;
}

class HttpClient {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private pendingRequests: Map<string, Promise<unknown>> = new Map();

  useRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  useResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  private async runRequestInterceptors(options: RequestOptions): Promise<RequestOptions> {
    let result = options;
    for (const interceptor of this.requestInterceptors) {
      result = await interceptor(result);
    }
    return result;
  }

  private async runResponseInterceptors<T>(
    response: WechatMiniprogram.RequestSuccessCallbackResult,
  ): Promise<T> {
    let result = response as unknown;
    for (const interceptor of this.responseInterceptors) {
      result = await interceptor(result as WechatMiniprogram.RequestSuccessCallbackResult);
    }
    return result as T;
  }

  request<T = unknown>(options: RequestOptions): Promise<T> {
    const requestKey = `${options.method || 'GET'}_${options.url}_${JSON.stringify(options.data || {})}`;

    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey) as Promise<T>;
    }

    const promise = this.doRequest<T>(options).finally(() => {
      this.pendingRequests.delete(requestKey);
    });

    this.pendingRequests.set(requestKey, promise);
    return promise;
  }

  private async doRequest<T>(rawOptions: RequestOptions): Promise<T> {
    const options = await this.runRequestInterceptors({
      method: 'GET',
      timeout: REQUEST_DEFAULTS.TIMEOUT,
      loading: false,
      showError: true,
      retry: 0,
      retryDelay: REQUEST_DEFAULTS.RETRY_DELAY,
      header: {
        'Content-Type': 'application/json',
      },
      ...rawOptions,
    });

    if (!options.url.startsWith('http')) {
      options.url = config.apiBaseUrl + options.url;
    }

    if (options.loading) {
      wx.showLoading({ title: REQUEST_DEFAULTS.LOADING_TEXT, mask: true });
    }

    const startTime = Date.now();
    let lastError: RequestError | null = null;
    const maxRetries = (options.retry ?? 0) + 1;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        if (attempt > 0 && options.retryDelay) {
          await this.delay(options.retryDelay * attempt);
        }

        const response = await this.wxRequest(options);
        const duration = Date.now() - startTime;

        performanceTracker?.trackRequest?.(options.url, duration, true);

        if (options.loading) wx.hideLoading();

        if (response.statusCode < 200 || response.statusCode >= 300) {
          const err: RequestError = new Error(`HTTP ${response.statusCode}: ${options.url}`);
          err.statusCode = response.statusCode;
          err.url = options.url;
          err.method = options.method;
          err.data = response.data;
          throw err;
        }

        const data = await this.runResponseInterceptors<T>(response);

        const apiData = response.data as ApiResponse<T>;
        if (apiData && typeof apiData === 'object' && 'code' in apiData) {
          if (apiData.code !== '0' && apiData.code !== '200') {
            const err: RequestError = new Error(apiData.message || '请求失败');
            err.code = String(apiData.code);
            err.url = options.url;
            err.method = options.method;
            err.data = apiData.data;
            throw err;
          }
        }

        return data !== undefined ? data : (response.data as T);
      } catch (err) {
        lastError = err as RequestError;
        const isNetworkError = !lastError.statusCode;
        if (attempt < maxRetries - 1 && isNetworkError) {
          continue;
        }
        break;
      }
    }

    const duration = Date.now() - startTime;
    performanceTracker?.trackRequest?.(options.url, duration, false);
    if (lastError) {
      errorReporter?.report?.(lastError);
    }

    if (options.loading) wx.hideLoading();

    if (options.showError && lastError) {
      wx.showToast({
        title: lastError.message || '网络请求失败',
        icon: 'none',
        duration: 2000,
      });
    }

    throw lastError || new Error('Unknown request error');
  }

  private wxRequest(
    options: RequestOptions,
  ): Promise<WechatMiniprogram.RequestSuccessCallbackResult> {
    return new Promise((resolve, reject) => {
      wx.request({
        url: options.url,
        method: options.method || 'GET',
        data: options.data,
        header: options.header,
        timeout: options.timeout,
        success: (res) => resolve(res),
        fail: (err) => reject(err),
      });
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  get<T = unknown>(url: string, options?: Partial<RequestOptions>): Promise<T> {
    return this.request<T>({ ...options, url, method: 'GET' });
  }

  post<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    options?: Partial<RequestOptions>,
  ): Promise<T> {
    return this.request<T>({ ...options, url, method: 'POST', data });
  }

  put<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    options?: Partial<RequestOptions>,
  ): Promise<T> {
    return this.request<T>({ ...options, url, method: 'PUT', data });
  }

  delete<T = unknown>(url: string, options?: Partial<RequestOptions>): Promise<T> {
    return this.request<T>({ ...options, url, method: 'DELETE' });
  }
}

export const http = new HttpClient();

http.useRequestInterceptor((options) => {
  const token = wx.getStorageSync('token');
  if (token) {
    options.header = {
      ...options.header,
      Authorization: `Bearer ${token}`,
    };
  }
  return options;
});

http.useResponseInterceptor((response) => {
  const data = response.data as ApiResponse;
  if (data && typeof data === 'object' && 'data' in data) {
    return data.data;
  }
  return data;
});

export default http;
