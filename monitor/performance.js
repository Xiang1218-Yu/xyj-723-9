"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackTiming = trackTiming;
exports.createPageTimer = createPageTimer;
exports.initPerformanceMonitor = initPerformanceMonitor;
/**
 * 性能监控：采集小程序启动、页面渲染、接口耗时等指标
 * @module monitor/performance
 */
const reporter_1 = require("./reporter");
const request_1 = require("../api/request");
/** 记录一次自定义耗时指标 */
function trackTiming(name, duration, extra) {
    (0, reporter_1.report)({ type: 'performance', name, value: duration, extra });
}
/** 页面级计时器：在 onLoad 开始，onReady 结束 */
function createPageTimer(pageName) {
    const start = Date.now();
    return {
        done: () => trackTiming('pageRender', Date.now() - start, { page: pageName }),
    };
}
/**
 * 初始化性能监控
 * - 采集启动耗时（借助 wx.getPerformance）
 * - 通过响应拦截器采集接口耗时
 */
function initPerformanceMonitor(launchStart) {
    // 启动耗时
    trackTiming('appLaunch', Date.now() - launchStart);
    // 原生 Performance 面板数据（如首屏等）
    if (typeof wx.getPerformance === 'function') {
        try {
            const observer = wx.getPerformance().createObserver((entryList) => {
                entryList.getEntries().forEach((entry) => {
                    trackTiming(`perf:${entry.entryType}`, entry.duration || 0, {
                        name: entry.name,
                    });
                });
            });
            observer.observe({ entryTypes: ['render', 'script', 'navigation'] });
        }
        catch {
            /* 部分基础库不支持，忽略 */
        }
    }
    // 接口耗时：复用统一请求层的响应拦截器
    (0, request_1.useResponseInterceptor)(({ options, statusCode, duration, error }) => {
        (0, reporter_1.report)({
            type: 'api',
            name: options.url,
            value: duration,
            extra: { statusCode, method: options.method, ok: !error },
        });
    });
}
//# sourceMappingURL=performance.js.map