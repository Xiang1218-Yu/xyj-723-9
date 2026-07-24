import { getConfig } from '../config/index';
import { MONITOR_DEFAULTS } from '../constants/index';
import type { ErrorReport, ReporterConfig } from '../types/monitor';

const config = getConfig();

class Reporter {
  private queue: ErrorReport[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;
  private cfg: ReporterConfig;

  constructor() {
    this.cfg = {
      reportUrl: config.reportUrl,
      appId: 'wx2aefbd32eb051c2c',
      appVersion: '2.0.0',
      enableInDev: false,
      maxQueueSize: MONITOR_DEFAULTS.MAX_QUEUE_SIZE,
      flushInterval: MONITOR_DEFAULTS.FLUSH_INTERVAL,
      sampleRate: MONITOR_DEFAULTS.ERROR_SAMPLE_RATE,
    };
  }

  configure(options: Partial<ReporterConfig>): void {
    this.cfg = { ...this.cfg, ...options };
  }

  start(): void {
    if (this.timer) return;
    if (config.env === 'development' && !this.cfg.enableInDev) return;

    this.timer = setInterval(() => {
      this.flush();
    }, this.cfg.flushInterval);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.flush();
  }

  report(error: ErrorReport): void {
    if (config.env === 'development' && !this.cfg.enableInDev) {
      console.warn('[Reporter]', error);
      return;
    }

    if (Math.random() > this.cfg.sampleRate) return;

    this.queue.push(error);

    if (this.queue.length >= this.cfg.maxQueueSize) {
      this.flush();
    }
  }

  flush(): void {
    if (this.queue.length === 0) return;

    const reports = this.queue.splice(0, this.queue.length);
    const payload = {
      appId: this.cfg.appId,
      appVersion: this.cfg.appVersion,
      env: config.env,
      reports,
    };

    if (!this.cfg.reportUrl) {
      console.warn('[Reporter] No report URL configured, reports dropped:', reports.length);
      return;
    }

    wx.request({
      url: this.cfg.reportUrl + '/api/report/batch',
      method: 'POST',
      data: payload,
      header: { 'Content-Type': 'application/json' },
      success: () => {
        // reported successfully
      },
      fail: (err) => {
        console.error('[Reporter] Failed to send reports:', err);
        this.queue.unshift(...reports.slice(0, 5));
      },
    });
  }
}

export const reporter = new Reporter();
export default reporter;
