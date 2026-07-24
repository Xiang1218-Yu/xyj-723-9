interface ErrorLog {
  type: 'jsError' | 'apiError' | 'resourceError' | 'pageError';
  message: string;
  stack?: string;
  url?: string;
  timestamp: number;
  extra?: Record<string, unknown>;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  extra?: Record<string, unknown>;
}

class Monitor {
  private errorQueue: ErrorLog[] = [];
  private performanceQueue: PerformanceMetric[] = [];
  private maxQueueSize = 10;
  private reportUrl = '';
  private isReporting = false;

  constructor() {
    this.initErrorHandler();
    this.initPerformanceObserver();
  }

  private initErrorHandler() {
    if (typeof wx !== 'undefined') {
      wx.onError && wx.onError(this.handleJsError.bind(this));
      wx.onUnhandledRejection && wx.onUnhandledRejection(this.handlePromiseError.bind(this));
    }
  }

  private initPerformanceObserver() {
    if (typeof wx !== 'undefined') {
      const performance = wx.getPerformance?.();
      if (performance) {
        try {
          const observer = performance.createObserver((entryList: WechatMiniprogram.PerformanceEntry[]) => {
            entryList.getEntries().forEach(entry => {
              this.recordPerformance(entry.name, entry.duration || 0, { entryType: entry.entryType });
            });
          });
          observer.observe({ entryTypes: ['render', 'script', 'navigation'] });
        } catch (e) {
          console.warn('Performance observer not supported');
        }
      }
    }
  }

  private handleJsError(error: string | Error) {
    const errorLog: ErrorLog = {
      type: 'jsError',
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      timestamp: Date.now()
    };
    this.addError(errorLog);
  }

  private handlePromiseError(res: WechatMiniprogram.OnUnhandledRejectionCallbackResult) {
    const errorLog: ErrorLog = {
      type: 'jsError',
      message: res.reason?.message || 'Unhandled Promise Rejection',
      stack: res.reason?.stack,
      timestamp: Date.now()
    };
    this.addError(errorLog);
  }

  public reportError(
    type: ErrorLog['type'],
    extra: Record<string, unknown>,
    error?: Error
  ) {
    const errorLog: ErrorLog = {
      type,
      message: error?.message || String(extra.message || 'Unknown error'),
      stack: error?.stack,
      timestamp: Date.now(),
      extra
    };
    this.addError(errorLog);
  }

  public reportPerformance(
    name: string,
    value: number,
    extra?: Record<string, unknown>
  ) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      extra
    };
    this.performanceQueue.push(metric);

    if (this.performanceQueue.length >= this.maxQueueSize) {
      this.flushPerformance();
    }
  }

  private addError(errorLog: ErrorLog) {
    console.error('[Monitor Error]', errorLog);
    this.errorQueue.push(errorLog);

    if (this.errorQueue.length >= this.maxQueueSize) {
      this.flushErrors();
    }
  }

  private recordPerformance(name: string, value: number, extra?: Record<string, unknown>) {
    this.reportPerformance(name, value, extra);
  }

  private async flushErrors() {
    if (this.isReporting || this.errorQueue.length === 0) return;

    this.isReporting = true;
    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      if (this.reportUrl) {
        await new Promise<void>((resolve, reject) => {
          wx.request({
            url: this.reportUrl,
            method: 'POST',
            data: {
              type: 'errors',
              data: errors,
              appId: wx.getStorageSync('appId') || '',
              systemInfo: wx.getSystemInfoSync()
            },
            success: () => resolve(),
            fail: reject
          });
        });
      }
    } catch (e) {
      this.errorQueue.unshift(...errors);
    } finally {
      this.isReporting = false;
    }
  }

  private async flushPerformance() {
    if (this.isReporting || this.performanceQueue.length === 0) return;

    this.isReporting = true;
    const metrics = [...this.performanceQueue];
    this.performanceQueue = [];

    try {
      if (this.reportUrl) {
        await new Promise<void>((resolve, reject) => {
          wx.request({
            url: this.reportUrl,
            method: 'POST',
            data: {
              type: 'performance',
              data: metrics,
              appId: wx.getStorageSync('appId') || '',
              systemInfo: wx.getSystemInfoSync()
            },
            success: () => resolve(),
            fail: reject
          });
        });
      }
    } catch (e) {
      this.performanceQueue.unshift(...metrics);
    } finally {
      this.isReporting = false;
    }
  }

  public setReportUrl(url: string) {
    this.reportUrl = url;
  }

  public pageStart(pageName: string) {
    this.reportPerformance('page_start', Date.now(), { pageName });
  }

  public pageEnd(pageName: string, startTime: number) {
    this.reportPerformance('page_duration', Date.now() - startTime, { pageName });
  }
}

const monitor = new Monitor();

export const reportError = monitor.reportError.bind(monitor);
export const reportPerformance = monitor.reportPerformance.bind(monitor);
export const setReportUrl = monitor.setReportUrl.bind(monitor);
export const pageStart = monitor.pageStart.bind(monitor);
export const pageEnd = monitor.pageEnd.bind(monitor);

export default monitor;
