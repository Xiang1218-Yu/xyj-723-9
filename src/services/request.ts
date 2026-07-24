import { API_BASE_URL, REQUEST_TIMEOUT, HTTP_STATUS, ERROR_MESSAGES } from '../constants';
import { reportError, reportPerformance } from '../monitor';

interface RequestOptions<T = unknown> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: T;
  header?: Record<string, string>;
  timeout?: number;
  showLoading?: boolean;
  showError?: boolean;
}

interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

class Request {
  private baseURL: string;
  private timeout: number;
  private pendingRequests: Map<string, WechatMiniprogram.RequestTask>;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = REQUEST_TIMEOUT;
    this.pendingRequests = new Map();
  }

  private getRequestKey(url: string, method: string, data?: unknown): string {
    return `${method}_${url}_${JSON.stringify(data || {})}`;
  }

  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    };

    const token = wx.getStorageSync('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private handleSuccess<T>(
    response: WechatMiniprogram.RequestSuccessCallbackResult,
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: unknown) => void,
    url: string,
    startTime: number
  ) {
    const duration = Date.now() - startTime;
    reportPerformance('api_request', duration, { url, status: response.statusCode });

    if (response.statusCode === HTTP_STATUS.SUCCESS) {
      const data = response.data as ApiResponse<T>;
      if (data.code === 0 || data.code === 200) {
        resolve(data.data);
      } else {
        this.handleBusinessError(data, reject);
      }
    } else {
      this.handleHttpError(response.statusCode, reject);
    }
  }

  private handleBusinessError(
    data: ApiResponse,
    reject: (reason?: unknown) => void
  ) {
    const error = new Error(data.message || ERROR_MESSAGES.UNKNOWN_ERROR);
    reportError('apiError', {
      code: data.code,
      message: data.message
    });
    reject(error);
  }

  private handleHttpError(
    statusCode: number,
    reject: (reason?: unknown) => void
  ) {
    let message = ERROR_MESSAGES.UNKNOWN_ERROR;
    switch (statusCode) {
      case HTTP_STATUS.BAD_REQUEST:
        message = '请求参数错误';
        break;
      case HTTP_STATUS.UNAUTHORIZED:
        message = '登录已过期，请重新登录';
        break;
      case HTTP_STATUS.FORBIDDEN:
        message = '没有访问权限';
        break;
      case HTTP_STATUS.NOT_FOUND:
        message = '请求资源不存在';
        break;
      case HTTP_STATUS.INTERNAL_ERROR:
        message = ERROR_MESSAGES.SERVER_ERROR;
        break;
    }
    const error = new Error(message);
    reportError('apiError', { statusCode, message });
    reject(error);
  }

  private handleFail(
    error: WechatMiniprogram.GeneralCallbackResult,
    reject: (reason?: unknown) => void
  ) {
    let message = ERROR_MESSAGES.NETWORK_ERROR;
    if (error.errMsg?.includes('timeout')) {
      message = ERROR_MESSAGES.TIMEOUT_ERROR;
    }
    const err = new Error(message);
    reportError('apiError', { errMsg: error.errMsg });
    reject(err);
  }

  request<T = unknown, D = unknown>(options: RequestOptions<D>): Promise<T> {
    const {
      url,
      method = 'GET',
      data,
      header,
      timeout = this.timeout,
      showLoading = false,
      showError = true
    } = options;

    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    const requestKey = this.getRequestKey(fullUrl, method, data);

    if (this.pendingRequests.has(requestKey)) {
      this.pendingRequests.get(requestKey)?.abort();
    }

    if (showLoading) {
      wx.showLoading({ title: '加载中...', mask: true });
    }

    const startTime = Date.now();

    return new Promise<T>((resolve, reject) => {
      const requestTask = wx.request({
        url: fullUrl,
        method,
        data,
        header: this.getHeaders(header),
        timeout,
        success: res => {
          if (showLoading) wx.hideLoading();
          this.handleSuccess(res, resolve, reject, fullUrl, startTime);
        },
        fail: err => {
          if (showLoading) wx.hideLoading();
          this.handleFail(err, reject);
        },
        complete: () => {
          this.pendingRequests.delete(requestKey);
        }
      });

      this.pendingRequests.set(requestKey, requestTask);
    });
  }

  get<T = unknown>(url: string, params?: Record<string, unknown>, options?: Partial<RequestOptions>): Promise<T> {
    const queryString = params
      ? Object.entries(params)
          .filter(([, value]) => value !== undefined && value !== null)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&')
      : '';
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return this.request<T>({ ...options, url: fullUrl, method: 'GET' });
  }

  post<T = unknown, D = unknown>(url: string, data?: D, options?: Partial<RequestOptions<D>>): Promise<T> {
    return this.request<T, D>({ ...options, url, method: 'POST', data });
  }

  put<T = unknown, D = unknown>(url: string, data?: D, options?: Partial<RequestOptions<D>>): Promise<T> {
    return this.request<T, D>({ ...options, url, method: 'PUT', data });
  }

  delete<T = unknown>(url: string, options?: Partial<RequestOptions>): Promise<T> {
    return this.request<T>({ ...options, url, method: 'DELETE' });
  }
}

export const http = new Request();
