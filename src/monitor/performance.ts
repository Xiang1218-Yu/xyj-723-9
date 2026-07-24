/**
 * 性能监控：采集小程序启动、页面渲染、接口耗时等指标
 * @module monitor/performance
 */
import { report } from './reporter';
import { useResponseInterceptor } from '../api/request';

/** 记录一次自定义耗时指标 */
export function trackTiming(name: string, duration: number, extra?: Record<string, unknown>): void {
  report({ type: 'performance', name, value: duration, extra });
}

/** 页面级计时器：在 onLoad 开始，onReady 结束 */
export function createPageTimer(pageName: string): { done: () => void } {
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
export function initPerformanceMonitor(launchStart: number): void {
  // 启动耗时
  trackTiming('appLaunch', Date.now() - launchStart);

  // 原生 Performance 面板数据（如首屏等）
  if (typeof wx.getPerformance === 'function') {
    try {
      const observer = wx.getPerformance().createObserver((entryList) => {
        entryList.getEntries().forEach((entry: WechatMiniprogram.PerformanceEntry) => {
          trackTiming(`perf:${entry.entryType}`, entry.duration || 0, {
            name: entry.name,
          });
        });
      });
      observer.observe({ entryTypes: ['render', 'script', 'navigation'] });
    } catch {
      /* 部分基础库不支持，忽略 */
    }
  }

  // 接口耗时：复用统一请求层的响应拦截器
  useResponseInterceptor(({ options, statusCode, duration, error }) => {
    report({
      type: 'api',
      name: options.url,
      value: duration,
      extra: { statusCode, method: options.method, ok: !error },
    });
  });
}
