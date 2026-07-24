import { http } from './request';
import { API_PATHS } from '../constants/index';
import type { QueryResponse, QueryResult, QuerySid } from '../types/query';

/**
 * 执行归属地查询
 * @param q 查询内容（银行卡号/手机号/身份证号）
 */
export function queryInfo(q: string): Promise<QueryResponse> {
  return http.post<QueryResponse>(API_PATHS.QUERY_INFO, { q });
}

/**
 * 根据 SID 判断查询类型
 */
export function getQueryType(sid: QuerySid): 'bank' | 'phone' | 'idcard' {
  const map: Record<QuerySid, 'bank' | 'phone' | 'idcard'> = {
    S100: 'bank',
    S101: 'phone',
    S102: 'idcard',
  };
  return map[sid];
}

/**
 * 解析查询结果，统一格式
 */
export function parseQueryResult(response: QueryResponse): {
  type: 'bank' | 'phone' | 'idcard';
  data: QueryResult;
} {
  return {
    type: getQueryType(response.sid),
    data: response.data,
  };
}
