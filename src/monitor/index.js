class Monitor {
  constructor() {
    this.errorQueue = [];
    this.performanceQueue = [];
    this.maxQueueSize = 10;
    this.reportUrl = '';
    this.isReporting = false;
    this.initErrorHandler();
    this.initPerformanceObserver();
  }

  initErrorHandler() {
    if (typeof wx !== 'undefined') {
      if (wx.onError) {
        wx.onError(this.handleJsError.bind(this));
      }
      if (wx.onUnhandledRejection) {
        wx.onUnhandledRejection(this.handlePromiseError.bind(this));
      }
    }
  }

  initPerformanceObserver() {
    if (typeof wx !== 'undefined') {
      try {
        const performance = wx.getPerformance && wx.getPerformance();
        if (performance && performance.createObserver) {
          const observer = performance.createObserver(entryList => {
            entryList.getEntries().forEach(entry => {
              this.recordPerformance(entry.name, entry.duration || 0, { entryType: entry.entryType });
            });
          });
          observer.observe({ entryTypes: ['render', 'script', 'navigation'] });
        }
      } catch (e) {
        console.warn('Performance observer not supported');
      }
    }
  }

  handleJsError(error) {
    const errorLog = {
      type: 'jsError',
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      timestamp: Date.now()
    };
    this.addError(errorLog);
  }

  handlePromiseError(res) {
    const errorLog = {
      type: 'jsError',
      message: (res.reason && res.reason.message) || 'Unhandled Promise Rejection',
      stack: res.reason && res.reason.stack,
      timestamp: Date.now()
    };
    this.addError(errorLog);
  }

  reportError(type, extra, error) {
    const errorLog = {
      type,
      message: (error && error.message) || String((extra && extra.message) || 'Unknown error'),
      stack: error && error.stack,
      timestamp: Date.now(),
      extra
    };
    this.addError(errorLog);
  }

  reportPerformance(name, value, extra) {
    const metric = {
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

  addError(errorLog) {
    console.error('[Monitor Error]', errorLog);
    this.errorQueue.push(errorLog);

    if (this.errorQueue.length >= this.maxQueueSize) {
      this.flushErrors();
    }
  }

  recordPerformance(name, value, extra) {
    this.reportPerformance(name, value, extra);
  }

  async flushErrors() {
    if (this.isReporting || this.errorQueue.length === 0) return;

    this.isReporting = true;
    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      if (this.reportUrl) {
        await new Promise((resolve, reject) => {
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

  async flushPerformance() {
    if (this.isReporting || this.performanceQueue.length === 0) return;

    this.isReporting = true;
    const metrics = [...this.performanceQueue];
    this.performanceQueue = [];

    try {
      if (this.reportUrl) {
        await new Promise((resolve, reject) => {
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

  setReportUrl(url) {
    this.reportUrl = url;
  }

  pageStart(pageName) {
    this.reportPerformance('page_start', Date.now(), { pageName });
  }

  pageEnd(pageName, startTime) {
    this.reportPerformance('page_duration', Date.now() - startTime, { pageName });
  }
}

const monitor = new Monitor();

module.exports = {
  reportError: monitor.reportError.bind(monitor),
  reportPerformance: monitor.reportPerformance.bind(monitor),
  setReportUrl: monitor.setReportUrl.bind(monitor),
  pageStart: monitor.pageStart.bind(monitor),
  pageEnd: monitor.pageEnd.bind(monitor),
  default: monitor
};
