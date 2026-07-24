/**
 * 归属地查询（银行卡/手机号/身份证）相关类型
 * @module types/lookup
 */

/** 查询命中类型标识 */
export type LookupSid = 'S100' | 'S101' | 'S102';

/** 银行卡信息 */
export interface BankInfo {
  bankName: string;
  cardType?: string;
  cardName?: string;
}

/** 手机号归属信息 */
export interface PhoneInfo {
  province?: string;
  city?: string;
  operator?: string;
}

/** 身份证信息 */
export interface IdCardInfo {
  province?: string;
  city?: string;
  area?: string;
  birthday?: string;
  sex?: string;
}

/** 查询结果联合类型 */
export type LookupData = BankInfo | PhoneInfo | IdCardInfo;
