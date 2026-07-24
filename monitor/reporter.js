"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flush = flush;
exports.report = report;
/**
 * 上报器：批量、节流地将监控数据发送到后端
 * @module monitor/reporter
 */
const index_1 = require("../config/index");
const queue = [];
const MAX_BATCH = 10;
const FLUSH_INTERVAL = 5000;
let timer = null;
/** 采集设备与版本上下文 */
function baseContext() {
    try {
        const sys = wx.getSystemInfoSync();
        const account = wx.getAccountInfoSync();
        return {
            brand: sys.brand,
            model: sys.model,
            system: sys.system,
            platform: sys.platform,
            sdkVersion: sys.SDKVersion,
            version: account.miniProgram.version,
            envVersion: account.miniProgram.envVersion,
        };
    }
    catch {
        return {};
    }
}
/** 立即发送队列中的数据 */
function flush() {
    if (queue.length === 0) {
        return;
    }
    const batch = queue.splice(0, queue.length);
    wx.request({
        url: index_1.config.reportURL,
        method: 'POST',
        data: { context: baseContext(), items: batch },
        // 上报失败不重试、不阻塞、不弹窗，避免影响主流程
        fail: () => {
            /* 静默丢弃 */
        },
    });
}
/** 加入上报队列 */
function report(item) {
    queue.push({ ...item, timestamp: Date.now() });
    if (queue.length >= MAX_BATCH) {
        flush();
        return;
    }
    if (!timer) {
        timer = setTimeout(() => {
            timer = null;
            flush();
        }, FLUSH_INTERVAL);
    }
}
//# sourceMappingURL=reporter.js.map