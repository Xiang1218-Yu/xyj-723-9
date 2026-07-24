/**
 * 国际包裹快递查询相关类型
 * @module types/express
 */

/** 快递单一节点轨迹 */
export interface TrackTrans {
  /** 时间 */
  time?: string;
  /** 地点/描述 */
  context?: string;
}

/** 快递轨迹状态 */
export type TrackStatus = 'Delivered' | 'Expired' | 'DeliverFailed' | 'Transit' | 'PickUp' | string;

/** 单条历史查询记录 */
export interface TrackHistory {
  TrackingNumber: string;
  Status: TrackStatus;
  /** 本地缓存唯一 key */
  unique?: string;
  /** 前端计算的样式类 */
  css?: string;
  /** 图标类型 */
  iconType?: string;
}

/** 轨迹状态对应的展示样式 */
export interface TrackStateStyle {
  css: 'track-success' | 'track-error' | 'track-info' | 'track-null';
  iconType: 'success' | 'warn' | 'waiting' | 'clear';
}

/** 快递查询接口返回的数据体 */
export interface ExpressData {
  trans: TrackTrans[];
  Status?: TrackStatus;
}
