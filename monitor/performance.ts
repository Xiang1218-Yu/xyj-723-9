import { reporter } from './reporter';
import { getConfig } from '../config/index';
import { MONITOR_DEFAULTS, STORAGE_KEYS } from '../constants/index';
import type { PerformanceMetric, PerformanceMetricName } from '../types/monitor';
import { storage } from '../utils/storage';

const config = getConfig();

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private timers: Map<string, number> = new Map();
  private pageTimers: Map<string, { load: number; ready: number }> = new Map();
  private sampleRate = MONITOR_DEFAULTS.PERF_SAMPLE_RATE;
  private maxMetrics = MONITOR_DEFAULTS.MAX_METRICS_STORED;
  private appStartTime = 0;

  init(): void {
    this.appStartTime = Date.now();
    this.loadStoredMetrics();
  }

  markAppLaunch(): void {
    const duration = Date.now() - this.appStartTime;
    this.record('appLaunch', duration);
  }

  markPageLoad(route: string): void {
    this.pageTimers.set(route, { load: Date.now(), ready: 0 });
  }

  markPageReady(route: string): void {
    const timer = this.pageTimers.get(route);
    if (timer && timer.load) {
      timer.ready = Date.now();
      const duration = timer.ready - timer.load;
      this.record('pageReady', duration, route);
      this.pageTimers.delete(route);
    }
  }

  wrapPage<T extends Record<string, unknown>>(options: T): T {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const perf = this;
    const wrapped: Record<string, unknown> = { ...options };

    const originalOnLoad = wrapped.onLoad;
    if (typeof originalOnLoad === 'function') {
      wrapped.onLoad = function (this: unknown, ...args: unknown[]) {
        const pages = getCurrentPages();
        const current = pages[pages.length - 1];
        const route = current ? current.route || '' : '';
        perf.markPageLoad(route);
        return (originalOnLoad as (...a: unknown[]) => unknown).apply(this, args);
      };
    }

    const originalOnReady = wrapped.onReady;
    if (typeof originalOnReady === 'function') {
      wrapped.onReady = function (this: unknown, ...args: unknown[]) {
        const pages = getCurrentPages();
        const current = pages[pages.length - 1];
        const route = current ? current.route || '' : '';
        perf.markPageReady(route);
        return (originalOnReady as (...a: unknown[]) => unknown).apply(this, args);
      };
    }

    return wrapped as T;
  }

  startTimer(name: string): void {
    this.timers.set(name, Date.now());
  }

  endTimer(name: string, metricName: PerformanceMetricName | string, page?: string): number {
    const start = this.timers.get(name);
    if (!start) return 0;
    const duration = Date.now() - start;
    this.timers.delete(name);
    this.record(metricName, duration, page);
    return duration;
  }

  trackRequest(url: string, duration: number, success: boolean): void {
    if (Math.random() > this.sampleRate) return;

    const metric: PerformanceMetric = {
      name: 'requestDuration',
      value: duration,
      timestamp: Date.now(),
      extra: { url, success },
    };

    this.addMetric(metric);

    if (duration > 3000) {
      reporter.report({
        name: 'SlowRequest',
        message: `Request to ${url} took ${duration}ms`,
        level: 'warning',
        url,
        timestamp: Date.now(),
        extra: { duration, success },
      });
    }
  }

  record(name: PerformanceMetricName | string, value: number, page?: string): void {
    if (Math.random() > this.sampleRate) return;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      page,
    };

    this.addMetric(metric);
  }

  private addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    if (metric.value > 1000 || metric.name === 'appLaunch') {
      reporter.report({
        name: 'PerformanceIssue',
        message: `${metric.name}: ${metric.value}ms`,
        level: metric.value > 3000 ? 'warning' : 'info',
        url: metric.page || '',
        timestamp: metric.timestamp,
        extra: { value: metric.value, ...metric.extra },
      });
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getMetricsSummary(): Record<string, { avg: number; max: number; min: number; count: number }> {
    const groups: Record<string, number[]> = {};
    this.metrics.forEach((m) => {
      if (!groups[m.name]) groups[m.name] = [];
      groups[m.name].push(m.value);
    });

    const summary: Record<string, { avg: number; max: number; min: number; count: number }> = {};
    for (const [name, values] of Object.entries(groups)) {
      summary[name] = {
        avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
        max: Math.max(...values),
        min: Math.min(...values),
        count: values.length,
      };
    }
    return summary;
  }

  flush(): void {
    if (this.metrics.length === 0) return;
    if (!config.reportUrl) return;

    const metrics = this.metrics.splice(0, this.metrics.length);
    storage.set(STORAGE_KEYS.PERFORMANCE_METRICS, metrics);

    wx.request({
      url: config.reportUrl + '/api/perf/batch',
      method: 'POST',
      data: {
        appId: 'wx2aefbd32eb051c2c',
        appVersion: '2.0.0',
        env: config.env,
        metrics,
      },
      header: { 'Content-Type': 'application/json' },
      fail: () => {
        this.metrics.unshift(...metrics);
      },
    });
  }

  private loadStoredMetrics(): void {
    const stored = storage.get<PerformanceMetric[]>(STORAGE_KEYS.PERFORMANCE_METRICS, []);
    if (stored && stored.length > 0) {
      this.metrics = stored;
    }
  }
}

export const perfMonitor = new PerformanceMonitor();
export default perfMonitor;
