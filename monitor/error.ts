import { reporter } from './reporter';
import { getConfig } from '../config/index';
import type { ErrorLevel, ErrorReport } from '../types/monitor';

const config = getConfig();

interface ErrorContext {
  page?: string;
  extra?: Record<string, unknown>;
}

class ErrorMonitor {
  private enabled = true;
  private systemInfo: WechatMiniprogram.SystemInfo | null = null;
  private installed = false;

  init(): void {
    if (this.installed) return;
    this.installed = true;

    try {
      this.systemInfo = wx.getSystemInfoSync();
    } catch {
      this.systemInfo = null;
    }

    wx.onError((error) => {
      const err = new Error(error.message || String(error));
      err.stack = error.stack;
      this.captureError(err, { page: this.getCurrentPage() });
    });

    wx.onUnhandledRejection((res) => {
      const rawReason = res.reason as unknown;
      let reason: Error;
      if (rawReason instanceof Error) {
        reason = rawReason;
      } else if (rawReason && typeof rawReason === 'object' && 'message' in rawReason) {
        reason = new Error(String((rawReason as { message: string }).message));
      } else {
        reason = new Error(String(rawReason));
      }
      this.captureError(reason, {
        page: this.getCurrentPage(),
        extra: { type: 'unhandledrejection' },
      });
    });
  }

  getCurrentPage(): string {
    const pages = getCurrentPages();
    const current = pages[pages.length - 1];
    return current ? current.route || '' : '';
  }

  wrapPage<T extends Record<string, unknown>>(options: T): T {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const monitor = this;
    const wrapped: Record<string, unknown> = { ...options };

    const lifecycleHooks = ['onLoad', 'onShow', 'onReady', 'onHide', 'onUnload'] as const;
    lifecycleHooks.forEach((hook) => {
      const original = wrapped[hook];
      if (typeof original === 'function') {
        wrapped[hook] = function (this: unknown, ...args: unknown[]) {
          const pageRoute = monitor.getCurrentPage();
          try {
            return (original as (...a: unknown[]) => unknown).apply(this, args);
          } catch (err) {
            monitor.captureError(err as Error, { page: pageRoute, extra: { hook } });
            throw err;
          }
        };
      }
    });

    return wrapped as T;
  }

  captureError(error: string | Error, context?: ErrorContext): void {
    const err = typeof error === 'string' ? new Error(error) : error;

    const report: ErrorReport = {
      name: err.name || 'UnknownError',
      message: err.message || String(error),
      stack: err.stack,
      level: this.determineLevel(err),
      url: `/${context?.page || this.getCurrentPage()}`,
      page: context?.page || this.getCurrentPage(),
      timestamp: Date.now(),
      systemInfo: this.systemInfo || undefined,
      extra: {
        ...(context?.extra || {}),
        env: config.env,
        sdkVersion: this.systemInfo?.SDKVersion,
        platform: this.systemInfo?.platform,
      },
    };

    reporter.report(report);

    if (config.env === 'development') {
      console.error('[ErrorMonitor]', report);
    }
  }

  captureMessage(message: string, level: ErrorLevel = 'info', context?: ErrorContext): void {
    const err = new Error(message);
    err.name = level.toUpperCase();
    this.captureError(err, context);
  }

  private determineLevel(error: Error): ErrorLevel {
    const msg = error.message.toLowerCase();
    if (msg.includes('timeout') || msg.includes('network')) return 'warning';
    if (error.name === 'TypeError' || error.name === 'ReferenceError') return 'error';
    if (msg.includes('fail') || msg.includes('失败')) return 'warning';
    return 'error';
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

export const errorMonitor = new ErrorMonitor();
export default errorMonitor;
