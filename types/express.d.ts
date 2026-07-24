/**
 * 快递状态枚举
 */
export enum ExpressStatus {
  Delivered = 'Delivered',
  Expired = 'Expired',
  DeliverFailed = 'DeliverFailed',
  Transit = 'Transit',
  PickUp = 'PickUp',
}

/**
 * 快递轨迹节点
 */
export interface ExpressTrack {
  time: string;
  context: string;
  status?: ExpressStatus;
}

/**
 * 快递状态样式
 */
export interface TrackStyle {
  css: string;
  iconType: 'success' | 'warn' | 'waiting' | 'clear';
}

/**
 * 快递查询结果
 */
export interface ExpressInfo {
  number: string;
  company?: string;
  status: ExpressStatus;
  tracks: ExpressTrack[];
  updateTime?: string;
}

/**
 * 快递历史记录
 */
export interface ExpressHistory {
  number: string;
  company?: string;
  queryTime: string;
  lastStatus?: ExpressStatus;
}

/**
 * 快递存储 Key 前缀
 */
export const TRACK_STORAGE_KEY_PREFIX = 'TN::';
