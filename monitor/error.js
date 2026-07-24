"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMonitor = void 0;
const reporter_1 = require("./reporter");
const index_1 = require("../config/index");
const config = (0, index_1.getConfig)();
class ErrorMonitor {
    constructor() {
        this.enabled = true;
        this.systemInfo = null;
        this.installed = false;
    }
    init() {
        if (this.installed)
            return;
        this.installed = true;
        try {
            this.systemInfo = wx.getSystemInfoSync();
        }
        catch (_a) {
            this.systemInfo = null;
        }
        wx.onError((error) => {
            const err = new Error(error.message || String(error));
            err.stack = error.stack;
            this.captureError(err, { page: this.getCurrentPage() });
        });
        wx.onUnhandledRejection((res) => {
            const rawReason = res.reason;
            let reason;
            if (rawReason instanceof Error) {
                reason = rawReason;
            }
            else if (rawReason && typeof rawReason === 'object' && 'message' in rawReason) {
                reason = new Error(String(rawReason.message));
            }
            else {
                reason = new Error(String(rawReason));
            }
            this.captureError(reason, {
                page: this.getCurrentPage(),
                extra: { type: 'unhandledrejection' },
            });
        });
    }
    getCurrentPage() {
        const pages = getCurrentPages();
        const current = pages[pages.length - 1];
        return current ? current.route || '' : '';
    }
    wrapPage(options) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const monitor = this;
        const wrapped = { ...options };
        const lifecycleHooks = ['onLoad', 'onShow', 'onReady', 'onHide', 'onUnload'];
        lifecycleHooks.forEach((hook) => {
            const original = wrapped[hook];
            if (typeof original === 'function') {
                wrapped[hook] = function (...args) {
                    const pageRoute = monitor.getCurrentPage();
                    try {
                        return original.apply(this, args);
                    }
                    catch (err) {
                        monitor.captureError(err, { page: pageRoute, extra: { hook } });
                        throw err;
                    }
                };
            }
        });
        return wrapped;
    }
    captureError(error, context) {
        var _a, _b;
        const err = typeof error === 'string' ? new Error(error) : error;
        const report = {
            name: err.name || 'UnknownError',
            message: err.message || String(error),
            stack: err.stack,
            level: this.determineLevel(err),
            url: `/${(context === null || context === void 0 ? void 0 : context.page) || this.getCurrentPage()}`,
            page: (context === null || context === void 0 ? void 0 : context.page) || this.getCurrentPage(),
            timestamp: Date.now(),
            systemInfo: this.systemInfo || undefined,
            extra: {
                ...((context === null || context === void 0 ? void 0 : context.extra) || {}),
                env: config.env,
                sdkVersion: (_a = this.systemInfo) === null || _a === void 0 ? void 0 : _a.SDKVersion,
                platform: (_b = this.systemInfo) === null || _b === void 0 ? void 0 : _b.platform,
            },
        };
        reporter_1.reporter.report(report);
        if (config.env === 'development') {
            console.error('[ErrorMonitor]', report);
        }
    }
    captureMessage(message, level = 'info', context) {
        const err = new Error(message);
        err.name = level.toUpperCase();
        this.captureError(err, context);
    }
    determineLevel(error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('timeout') || msg.includes('network'))
            return 'warning';
        if (error.name === 'TypeError' || error.name === 'ReferenceError')
            return 'error';
        if (msg.includes('fail') || msg.includes('失败'))
            return 'warning';
        return 'error';
    }
    setEnabled(enabled) {
        this.enabled = enabled;
    }
}
exports.errorMonitor = new ErrorMonitor();
exports.default = exports.errorMonitor;
//# sourceMappingURL=error.js.map