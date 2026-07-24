"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.perfMonitor = void 0;
const reporter_1 = require("./reporter");
const index_1 = require("../config/index");
const index_2 = require("../constants/index");
const storage_1 = require("../utils/storage");
const config = (0, index_1.getConfig)();
class PerformanceMonitor {
    constructor() {
        this.metrics = [];
        this.timers = new Map();
        this.pageTimers = new Map();
        this.sampleRate = index_2.MONITOR_DEFAULTS.PERF_SAMPLE_RATE;
        this.maxMetrics = index_2.MONITOR_DEFAULTS.MAX_METRICS_STORED;
        this.appStartTime = 0;
    }
    init() {
        this.appStartTime = Date.now();
        this.loadStoredMetrics();
    }
    markAppLaunch() {
        const duration = Date.now() - this.appStartTime;
        this.record('appLaunch', duration);
    }
    markPageLoad(route) {
        this.pageTimers.set(route, { load: Date.now(), ready: 0 });
    }
    markPageReady(route) {
        const timer = this.pageTimers.get(route);
        if (timer && timer.load) {
            timer.ready = Date.now();
            const duration = timer.ready - timer.load;
            this.record('pageReady', duration, route);
            this.pageTimers.delete(route);
        }
    }
    wrapPage(options) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const perf = this;
        const wrapped = { ...options };
        const originalOnLoad = wrapped.onLoad;
        if (typeof originalOnLoad === 'function') {
            wrapped.onLoad = function (...args) {
                const pages = getCurrentPages();
                const current = pages[pages.length - 1];
                const route = current ? current.route || '' : '';
                perf.markPageLoad(route);
                return originalOnLoad.apply(this, args);
            };
        }
        const originalOnReady = wrapped.onReady;
        if (typeof originalOnReady === 'function') {
            wrapped.onReady = function (...args) {
                const pages = getCurrentPages();
                const current = pages[pages.length - 1];
                const route = current ? current.route || '' : '';
                perf.markPageReady(route);
                return originalOnReady.apply(this, args);
            };
        }
        return wrapped;
    }
    startTimer(name) {
        this.timers.set(name, Date.now());
    }
    endTimer(name, metricName, page) {
        const start = this.timers.get(name);
        if (!start)
            return 0;
        const duration = Date.now() - start;
        this.timers.delete(name);
        this.record(metricName, duration, page);
        return duration;
    }
    trackRequest(url, duration, success) {
        if (Math.random() > this.sampleRate)
            return;
        const metric = {
            name: 'requestDuration',
            value: duration,
            timestamp: Date.now(),
            extra: { url, success },
        };
        this.addMetric(metric);
        if (duration > 3000) {
            reporter_1.reporter.report({
                name: 'SlowRequest',
                message: `Request to ${url} took ${duration}ms`,
                level: 'warning',
                url,
                timestamp: Date.now(),
                extra: { duration, success },
            });
        }
    }
    record(name, value, page) {
        if (Math.random() > this.sampleRate)
            return;
        const metric = {
            name,
            value,
            timestamp: Date.now(),
            page,
        };
        this.addMetric(metric);
    }
    addMetric(metric) {
        this.metrics.push(metric);
        if (this.metrics.length > this.maxMetrics) {
            this.metrics.shift();
        }
        if (metric.value > 1000 || metric.name === 'appLaunch') {
            reporter_1.reporter.report({
                name: 'PerformanceIssue',
                message: `${metric.name}: ${metric.value}ms`,
                level: metric.value > 3000 ? 'warning' : 'info',
                url: metric.page || '',
                timestamp: metric.timestamp,
                extra: { value: metric.value, ...metric.extra },
            });
        }
    }
    getMetrics() {
        return [...this.metrics];
    }
    getMetricsSummary() {
        const groups = {};
        this.metrics.forEach((m) => {
            if (!groups[m.name])
                groups[m.name] = [];
            groups[m.name].push(m.value);
        });
        const summary = {};
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
    flush() {
        if (this.metrics.length === 0)
            return;
        if (!config.reportUrl)
            return;
        const metrics = this.metrics.splice(0, this.metrics.length);
        storage_1.storage.set(index_2.STORAGE_KEYS.PERFORMANCE_METRICS, metrics);
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
    loadStoredMetrics() {
        const stored = storage_1.storage.get(index_2.STORAGE_KEYS.PERFORMANCE_METRICS, []);
        if (stored && stored.length > 0) {
            this.metrics = stored;
        }
    }
}
exports.perfMonitor = new PerformanceMonitor();
exports.default = exports.perfMonitor;
//# sourceMappingURL=performance.js.map