"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.http = exports.setErrorReporter = exports.setPerformanceTracker = void 0;
const index_1 = require("../config/index");
const index_2 = require("../constants/index");
const config = (0, index_1.getConfig)();
let performanceTracker = null;
let errorReporter = null;
function setPerformanceTracker(tracker) {
    performanceTracker = tracker;
}
exports.setPerformanceTracker = setPerformanceTracker;
function setErrorReporter(reporter) {
    errorReporter = reporter;
}
exports.setErrorReporter = setErrorReporter;
class HttpClient {
    constructor() {
        this.requestInterceptors = [];
        this.responseInterceptors = [];
        this.pendingRequests = new Map();
    }
    useRequestInterceptor(interceptor) {
        this.requestInterceptors.push(interceptor);
    }
    useResponseInterceptor(interceptor) {
        this.responseInterceptors.push(interceptor);
    }
    async runRequestInterceptors(options) {
        let result = options;
        for (const interceptor of this.requestInterceptors) {
            result = await interceptor(result);
        }
        return result;
    }
    async runResponseInterceptors(response) {
        let result = response;
        for (const interceptor of this.responseInterceptors) {
            result = await interceptor(result);
        }
        return result;
    }
    request(options) {
        const requestKey = `${options.method || 'GET'}_${options.url}_${JSON.stringify(options.data || {})}`;
        if (this.pendingRequests.has(requestKey)) {
            return this.pendingRequests.get(requestKey);
        }
        const promise = this.doRequest(options).finally(() => {
            this.pendingRequests.delete(requestKey);
        });
        this.pendingRequests.set(requestKey, promise);
        return promise;
    }
    async doRequest(rawOptions) {
        var _a, _b, _c, _d;
        const options = await this.runRequestInterceptors({
            method: 'GET',
            timeout: index_2.REQUEST_DEFAULTS.TIMEOUT,
            loading: false,
            showError: true,
            retry: 0,
            retryDelay: index_2.REQUEST_DEFAULTS.RETRY_DELAY,
            header: {
                'Content-Type': 'application/json',
            },
            ...rawOptions,
        });
        if (!options.url.startsWith('http')) {
            options.url = config.apiBaseUrl + options.url;
        }
        if (options.loading) {
            wx.showLoading({ title: index_2.REQUEST_DEFAULTS.LOADING_TEXT, mask: true });
        }
        const startTime = Date.now();
        let lastError = null;
        const maxRetries = ((_a = options.retry) !== null && _a !== void 0 ? _a : 0) + 1;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                if (attempt > 0 && options.retryDelay) {
                    await this.delay(options.retryDelay * attempt);
                }
                const response = await this.wxRequest(options);
                const duration = Date.now() - startTime;
                (_b = performanceTracker === null || performanceTracker === void 0 ? void 0 : performanceTracker.trackRequest) === null || _b === void 0 ? void 0 : _b.call(performanceTracker, options.url, duration, true);
                if (options.loading)
                    wx.hideLoading();
                if (response.statusCode < 200 || response.statusCode >= 300) {
                    const err = new Error(`HTTP ${response.statusCode}: ${options.url}`);
                    err.statusCode = response.statusCode;
                    err.url = options.url;
                    err.method = options.method;
                    err.data = response.data;
                    throw err;
                }
                const data = await this.runResponseInterceptors(response);
                const apiData = response.data;
                if (apiData && typeof apiData === 'object' && 'code' in apiData) {
                    if (apiData.code !== '0' && apiData.code !== '200') {
                        const err = new Error(apiData.message || '请求失败');
                        err.code = String(apiData.code);
                        err.url = options.url;
                        err.method = options.method;
                        err.data = apiData.data;
                        throw err;
                    }
                }
                return data !== undefined ? data : response.data;
            }
            catch (err) {
                lastError = err;
                const isNetworkError = !lastError.statusCode;
                if (attempt < maxRetries - 1 && isNetworkError) {
                    continue;
                }
                break;
            }
        }
        const duration = Date.now() - startTime;
        (_c = performanceTracker === null || performanceTracker === void 0 ? void 0 : performanceTracker.trackRequest) === null || _c === void 0 ? void 0 : _c.call(performanceTracker, options.url, duration, false);
        if (lastError) {
            (_d = errorReporter === null || errorReporter === void 0 ? void 0 : errorReporter.report) === null || _d === void 0 ? void 0 : _d.call(errorReporter, lastError);
        }
        if (options.loading)
            wx.hideLoading();
        if (options.showError && lastError) {
            wx.showToast({
                title: lastError.message || '网络请求失败',
                icon: 'none',
                duration: 2000,
            });
        }
        throw lastError || new Error('Unknown request error');
    }
    wxRequest(options) {
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
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    get(url, options) {
        return this.request({ ...options, url, method: 'GET' });
    }
    post(url, data, options) {
        return this.request({ ...options, url, method: 'POST', data });
    }
    put(url, data, options) {
        return this.request({ ...options, url, method: 'PUT', data });
    }
    delete(url, options) {
        return this.request({ ...options, url, method: 'DELETE' });
    }
}
exports.http = new HttpClient();
exports.http.useRequestInterceptor((options) => {
    const token = wx.getStorageSync('token');
    if (token) {
        options.header = {
            ...options.header,
            Authorization: `Bearer ${token}`,
        };
    }
    return options;
});
exports.http.useResponseInterceptor((response) => {
    const data = response.data;
    if (data && typeof data === 'object' && 'data' in data) {
        return data.data;
    }
    return data;
});
exports.default = exports.http;
//# sourceMappingURL=request.js.map