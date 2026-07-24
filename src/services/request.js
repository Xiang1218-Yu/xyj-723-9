const { API_BASE_URL, REQUEST_TIMEOUT, HTTP_STATUS, ERROR_MESSAGES } = require('../constants');
const { reportError, reportPerformance } = require('../monitor');

class Request {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = REQUEST_TIMEOUT;
    this.pendingRequests = new Map();
  }

  getRequestKey(url, method, data) {
    return `${method}_${url}_${JSON.stringify(data || {})}`;
  }

  getHeaders(customHeaders) {
    const headers = Object.assign(
      {
        'Content-Type': 'application/json'
      },
      customHeaders || {}
    );

    const token = wx.getStorageSync('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  handleSuccess(response, resolve, reject, url, startTime) {
    const duration = Date.now() - startTime;
    reportPerformance('api_request', duration, { url, status: response.statusCode });

    if (response.statusCode === HTTP_STATUS.SUCCESS) {
      const data = response.data;
      if (data.code === 0 || data.code === 200) {
        resolve(data.data);
      } else {
        this.handleBusinessError(data, reject);
      }
    } else {
      this.handleHttpError(response.statusCode, reject);
    }
  }

  handleBusinessError(data, reject) {
    const error = new Error(data.message || ERROR_MESSAGES.UNKNOWN_ERROR);
    reportError('apiError', {
      code: data.code,
      message: data.message
    });
    reject(error);
  }

  handleHttpError(statusCode, reject) {
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

  handleFail(error, reject) {
    let message = ERROR_MESSAGES.NETWORK_ERROR;
    if (error.errMsg && error.errMsg.includes('timeout')) {
      message = ERROR_MESSAGES.TIMEOUT_ERROR;
    }
    const err = new Error(message);
    reportError('apiError', { errMsg: error.errMsg });
    reject(err);
  }

  request(options) {
    const {
      url,
      method = 'GET',
      data,
      header,
      timeout = this.timeout,
      showLoading = false
    } = options;

    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    const requestKey = this.getRequestKey(fullUrl, method, data);

    if (this.pendingRequests.has(requestKey)) {
      const existingTask = this.pendingRequests.get(requestKey);
      if (existingTask) existingTask.abort();
    }

    if (showLoading) {
      wx.showLoading({ title: '加载中...', mask: true });
    }

    const startTime = Date.now();
    const self = this;

    return new Promise((resolve, reject) => {
      const requestTask = wx.request({
        url: fullUrl,
        method,
        data,
        header: self.getHeaders(header),
        timeout,
        success(res) {
          if (showLoading) wx.hideLoading();
          self.handleSuccess(res, resolve, reject, fullUrl, startTime);
        },
        fail(err) {
          if (showLoading) wx.hideLoading();
          self.handleFail(err, reject);
        },
        complete() {
          self.pendingRequests.delete(requestKey);
        }
      });

      self.pendingRequests.set(requestKey, requestTask);
    });
  }

  get(url, params, options) {
    let queryString = '';
    if (params) {
      queryString = Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
    }
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return this.request(Object.assign({}, options || {}, { url: fullUrl, method: 'GET' }));
  }

  post(url, data, options) {
    return this.request(Object.assign({}, options || {}, { url, method: 'POST', data }));
  }

  put(url, data, options) {
    return this.request(Object.assign({}, options || {}, { url, method: 'PUT', data }));
  }

  delete(url, options) {
    return this.request(Object.assign({}, options || {}, { url, method: 'DELETE' }));
  }
}

const http = new Request();

module.exports = { http };
