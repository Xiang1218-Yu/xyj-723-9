import { http } from './request';
import { API_PATHS } from '../constants/index';
import { expressStorage } from '../utils/storage';
import type { ExpressInfo, ExpressStatus } from '../types/express';

/**
 * 查询快递物流信息
 * @param number 快递单号
 */
export function fetchExpressInfo(number: string): Promise<ExpressInfo> {
  return http
    .get<ExpressInfo>(`${API_PATHS.EXPRESS_INFO}/${number}`, {
      showError: false,
    })
    .then((data) => {
      if (data) {
        expressStorage.save(number);
      }
      return data;
    });
}

/**
 * 获取快递历史记录
 */
export function getExpressHistory(): Array<{ number: string; time: string }> {
  return expressStorage.getAll();
}

/**
 * 删除快递历史记录
 */
export function removeExpressHistory(number: string): void {
  expressStorage.remove(number);
}

/**
 * 根据状态获取样式
 */
export function getTrackStatusStyle(status: ExpressStatus): {
  css: string;
  iconType: 'success' | 'warn' | 'waiting' | 'clear';
} {
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
