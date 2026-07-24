/**
 * 上报器：批量、节流地将监控数据发送到后端
 * @module monitor/reporter
 */
import { config } from '../config/index';

/** 上报数据类型 */
export type ReportType = 'performance' | 'error' | 'api';

/** 单条上报记录 */
export interface ReportItem {
  type: ReportType;
  /** 事件名，如 'appLaunch' / 'pageRender' / 'jsError' */
  name: string;
  /** 数值型指标，如耗时（毫秒） */
  value?: number;
  /** 附加信息 */
  extra?: Record<string, unknown>;
  /** 客户端时间戳 */
  timestamp: number;
}

const queue: ReportItem[] = [];
const MAX_BATCH = 10;
const FLUSH_INTERVAL = 5000;
let timer: ReturnType<typeof setTimeout> | null = null;

/** 采集设备与版本上下文 */
function baseContext(): Record<string, unknown> {
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
  } catch {
    return {};
  }
}

/** 立即发送队列中的数据 */
export function flush(): void {
  if (queue.length === 0) {
    return;
  }
  const batch = queue.splice(0, queue.length);
  wx.request({
    url: config.reportURL,
    method: 'POST',
    data: { context: baseContext(), items: batch },
    // 上报失败不重试、不阻塞、不弹窗，避免影响主流程
    fail: () => {
      /* 静默丢弃 */
    },
  });
}

/** 加入上报队列 */
export function report(item: Omit<ReportItem, 'timestamp'>): void {
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
