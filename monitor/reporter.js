"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reporter = void 0;
const index_1 = require("../config/index");
const index_2 = require("../constants/index");
const config = (0, index_1.getConfig)();
class Reporter {
    constructor() {
        this.queue = [];
        this.timer = null;
        this.cfg = {
            reportUrl: config.reportUrl,
            appId: 'wx2aefbd32eb051c2c',
            appVersion: '2.0.0',
            enableInDev: false,
            maxQueueSize: index_2.MONITOR_DEFAULTS.MAX_QUEUE_SIZE,
            flushInterval: index_2.MONITOR_DEFAULTS.FLUSH_INTERVAL,
            sampleRate: index_2.MONITOR_DEFAULTS.ERROR_SAMPLE_RATE,
        };
    }
    configure(options) {
        this.cfg = { ...this.cfg, ...options };
    }
    start() {
        if (this.timer)
            return;
        if (config.env === 'development' && !this.cfg.enableInDev)
            return;
        this.timer = setInterval(() => {
            this.flush();
        }, this.cfg.flushInterval);
    }
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.flush();
    }
    report(error) {
        if (config.env === 'development' && !this.cfg.enableInDev) {
            console.warn('[Reporter]', error);
            return;
        }
        if (Math.random() > this.cfg.sampleRate)
            return;
        this.queue.push(error);
        if (this.queue.length >= this.cfg.maxQueueSize) {
            this.flush();
        }
    }
    flush() {
        if (this.queue.length === 0)
            return;
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
exports.reporter = new Reporter();
exports.default = exports.reporter;
//# sourceMappingURL=reporter.js.map