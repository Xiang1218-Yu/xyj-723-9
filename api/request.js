"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRequestInterceptor = useRequestInterceptor;
exports.useResponseInterceptor = useResponseInterceptor;
exports.request = request;
exports.get = get;
exports.post = post;
/**
 * 统一网络请求封装
 *
 * 特性：
 * - Promise 化，替换分散的 wx.request 回调写法
 * - 统一 baseURL / 超时 / header
 * - 请求与响应拦截器（可用于埋点、鉴权、错误上报）
 * - 统一错误处理与可选 loading
 * - 泛型返回，配合 types 得到完整类型推断
 *
 * @module api/request
 */
const index_1 = require("../config/index");
const requestInterceptors = [];
const responseInterceptors = [];
/** 注册请求拦截器 */
function useRequestInterceptor(fn) {
    requestInterceptors.push(fn);
}
/** 注册响应拦截器（监控模块借此采集接口耗时/错误） */
function useResponseInterceptor(fn) {
    responseInterceptors.push(fn);
}
/** 拼接完整地址 */
function resolveURL(url) {
    if (/^https?:\/\//.test(url)) {
        return url;
    }
    const base = index_1.config.baseURL.replace(/\/$/, '');
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${base}${path}`;
}
/**
 * 发起请求
 * @template T 业务 data 的类型
 * @param options 请求配置
 * @returns 解析后的业务数据 data
 */
function request(options) {
    // 依次执行请求拦截器
    const finalOptions = requestInterceptors.reduce((opts, interceptor) => interceptor(opts), {
        method: 'GET',
        ...options,
    });
    if (finalOptions.loading) {
        wx.showLoading({ title: finalOptions.loadingText || '加载中', mask: true });
    }
    const startTime = Date.now();
    return new Promise((resolve, reject) => {
        wx.request({
            url: resolveURL(finalOptions.url),
            data: finalOptions.data || {},
            method: finalOptions.method,
            timeout: finalOptions.timeout || index_1.DEFAULT_TIMEOUT,
            header: {
                'Content-Type': 'application/json',
                ...finalOptions.header,
            },
            success: (res) => {
                const duration = Date.now() - startTime;
                responseInterceptors.forEach((fn) => fn({ options: finalOptions, statusCode: res.statusCode, data: res.data, duration }));
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    const body = res.data;
                    // 后端 code 约定：'0' 为成功
                    if (body && typeof body === 'object' && 'code' in body && body.code !== '0') {
                        handleBizError(body.msg || '请求失败', finalOptions.silent);
                        reject(new Error(body.msg || `业务错误: ${body.code}`));
                        return;
                    }
                    resolve((body && typeof body === 'object' && 'data' in body ? body.data : body));
                }
                else {
                    handleBizError(`网络错误 (${res.statusCode})`, finalOptions.silent);
                    reject(new Error(`HTTP ${res.statusCode}`));
                }
            },
            fail: (err) => {
                const duration = Date.now() - startTime;
                const error = new Error(err.errMsg || '请求失败');
                responseInterceptors.forEach((fn) => fn({ options: finalOptions, statusCode: -1, data: undefined, duration, error }));
                handleBizError('网络连接失败，请稍后重试', finalOptions.silent);
                reject(error);
            },
            complete: () => {
                if (finalOptions.loading) {
                    wx.hideLoading();
                }
            },
        });
    });
}
/** 统一错误提示 */
function handleBizError(message, silent) {
    if (!silent) {
        wx.showToast({ title: message, icon: 'none', duration: 1500 });
    }
}
/** GET 便捷方法 */
function get(url, options) {
    return request({ url, method: 'GET', ...options });
}
/** POST 便捷方法 */
function post(url, data, options) {
    return request({ url, method: 'POST', data, ...options });
}
//# sourceMappingURL=request.js.map