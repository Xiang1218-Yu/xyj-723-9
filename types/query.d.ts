/**
 * 归属地查询类型
 */
export type QueryType = 'bank' | 'phone' | 'idcard';

/**
 * 查询结果来源标识
 * - S100: 银行卡
 * - S101: 手机号
 * - S102: 身份证
 */
export type QuerySid = 'S100' | 'S101' | 'S102';

/**
 * 查询请求参数
 */
export interface QueryParams {
  q: string;
}

/**
 * 银行卡信息
 */
export interface BankInfo {
  bank: string;
  cardType: string;
  cardNumber: string;
  location?: string;
}

/**
 * 手机号信息
 */
export interface PhoneInfo {
  province: string;
  city: string;
  carrier: string;
  phoneNumber: string;
}

/**
 * 身份证信息
 */
export interface IdCardInfo {
  province: string;
  city: string;
  district: string;
  birthday: string;
  gender: '男' | '女';
  age: number;
}

/**
 * 查询结果联合类型
 */
export type QueryResult = BankInfo | PhoneInfo | IdCardInfo;

/**
 * 查询API响应
 */
export interface QueryResponse {
  code: string;
  sid: QuerySid;
  data: QueryResult;
  message?: string;
}
