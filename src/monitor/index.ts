/**
 * 监控体系统一入口
 * @module monitor
 */
export * from './reporter';
export * from './performance';
export * from './error';

import { initPerformanceMonitor } from './performance';
import { initErrorMonitor } from './error';

/**
 * 一键初始化监控（性能 + 错误）
 * @param launchStart App 启动起始时间戳
 */
export function initMonitor(launchStart: number): void {
  initErrorMonitor();
  initPerformanceMonitor(launchStart);
}
