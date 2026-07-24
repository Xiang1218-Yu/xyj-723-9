/**
 * 业务 API 集合：将各页面分散的 wx.request 收敛为按领域组织的接口方法
 * @module api/services
 */
import { get, post } from './request';
import type { RateData, LookupData, ExpressData, ApiResponse } from '../types';

/** 首页轮播图 */
export function fetchBanner(): Promise<{ data: Array<{ image: string }> }> {
  return get('/v1/h/images');
}

/**
 * 归属地综合查询（银行卡/手机号/身份证）
 * 后端通过 sid 区分命中类型，这里返回完整响应体以便页面判断
 */
export function lookupInfo(q: string): Promise<ApiResponse<LookupData>> {
  return post<ApiResponse<LookupData>>('/v1/wx/info', { q });
}

/** 查询汇率 */
export function fetchRate(from: string, to: string, date: string): Promise<RateData> {
  return get<RateData>(`/v1/wx/huobi/${from}/${to}/${date}`);
}

/** 国际包裹轨迹查询 */
export function fetchExpress(trackingNumber: string): Promise<ExpressData> {
  return post<ExpressData>(`/v1/exp/info/${trackingNumber}`);
}
