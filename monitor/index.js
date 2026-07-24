"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMonitor = initMonitor;
/**
 * 监控体系统一入口
 * @module monitor
 */
__exportStar(require("./reporter"), exports);
__exportStar(require("./performance"), exports);
__exportStar(require("./error"), exports);
const performance_1 = require("./performance");
const error_1 = require("./error");
/**
 * 一键初始化监控（性能 + 错误）
 * @param launchStart App 启动起始时间戳
 */
function initMonitor(launchStart) {
    (0, error_1.initErrorMonitor)();
    (0, performance_1.initPerformanceMonitor)(launchStart);
}
//# sourceMappingURL=index.js.map