/**
 * 性能指标类型
 */
export type PerformanceMetricName =
  | 'appLaunch'
  | 'pageLoad'
  | 'pageReady'
  | 'requestDuration'
  | 'scriptExecute'
  | 'setDataDuration'
  | 'firstRender'
  | 'routeDuration';

/**
 * 性能指标数据
 */
export interface PerformanceMetric {
  name: PerformanceMetricName | string;
  value: number;
  timestamp: number;
  page?: string;
  extra?: Record<string, unknown>;
}

/**
 * 性能监控配置
 */
export interface PerformanceConfig {
  sampleRate: number;
  reportUrl?: string;
  maxMetrics: number;
  enableNetworkTiming: boolean;
}

/**
 * 错误级别
 */
export type ErrorLevel = 'info' | 'warning' | 'error' | 'fatal';

/**
 * 错误报告数据
 */
export interface ErrorReport {
  name: string;
  message: string;
  stack?: string;
  level: ErrorLevel;
  url: string;
  page?: string;
  timestamp: number;
  userAgent?: string;
  systemInfo?: WechatMiniprogram.SystemInfo;
  extra?: Record<string, unknown>;
}

/**
 * 上报配置
 */
export interface ReporterConfig {
  reportUrl: string;
  appId: string;
  appVersion: string;
  enableInDev: boolean;
  maxQueueSize: number;
  flushInterval: number;
  sampleRate: number;
}
