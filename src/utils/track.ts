/**
 * 快递轨迹状态样式映射（原 untils/exputil.js 的 TS 版）
 * @module utils/track
 */
import type { TrackStatus, TrackStateStyle } from '../types';

/** 本地缓存历史记录 key 前缀 */
export const TRACK_STORAGE_KEY_PREFIX = 'TN::';

/** 根据轨迹状态返回展示样式 */
export function trackStateStyle(status: TrackStatus): TrackStateStyle {
  switch (status) {
    case 'Delivered':
      return { css: 'track-success', iconType: 'success' };
    case 'Expired':
    case 'DeliverFailed':
      return { css: 'track-error', iconType: 'warn' };
    case 'Transit':
    case 'PickUp':
      return { css: 'track-info', iconType: 'waiting' };
    default:
      return { css: 'track-null', iconType: 'clear' };
  }
}
