/**
 * 错误监控：全局 JS 异常、未处理的 Promise reject、以及手动上报
 * @module monitor/error
 */
import { report, flush } from './reporter';

/** 手动上报一条错误 */
export function reportError(name: string, error: unknown, extra?: Record<string, unknown>): void {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  report({ type: 'error', name, extra: { message, stack, ...extra } });
}

/**
 * 初始化错误监控。应在 app.ts 的 onLaunch 中调用。
 * 依赖 App 的 onError / onUnhandledRejection 生命周期转发进来。
 */
export function initErrorMonitor(): void {
  // 页面未捕获错误（部分基础库支持全局监听）
  if (typeof wx.onError === 'function') {
    wx.onError((err) => {
      const message = typeof err === 'string' ? err : (err as Error).message;
      report({ type: 'error', name: 'jsError', extra: { message } });
    });
  }
  if (typeof wx.onUnhandledRejection === 'function') {
    wx.onUnhandledRejection((res) => {
      reportError('unhandledRejection', res.reason);
    });
  }
  // 小程序进入后台时尽量把剩余队列发出去
  if (typeof wx.onAppHide === 'function') {
    wx.onAppHide(() => flush());
  }
}
