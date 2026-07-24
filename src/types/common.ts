/**
 * 全局通用类型定义
 * @module types/common
 */

/** HTTP 请求方法 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD';

/**
 * 后端统一响应结构
 * @template T data 字段的业务数据类型
 */
export interface ApiResponse<T = unknown> {
  /** 业务状态码，'0' 通常代表成功 */
  code: string;
  /** 业务子标识，如 S100/S101/S102 用于区分查询命中类型 */
  sid?: string;
  /** 提示信息 */
  msg?: string;
  /** 业务数据载荷 */
  data: T;
}

/** 请求配置项 */
export interface RequestOptions<D = Record<string, unknown>> {
  /** 相对或绝对地址，相对地址会拼接 baseURL */
  url: string;
  method?: HttpMethod;
  data?: D;
  header?: Record<string, string>;
  /** 单次请求超时（毫秒），缺省使用全局配置 */
  timeout?: number;
  /** 是否展示全局 loading，默认 false */
  loading?: boolean;
  /** loading 文案 */
  loadingText?: string;
  /** 是否静默处理错误（不弹 toast），默认 false */
  silent?: boolean;
}

/** 键值对参数 */
export type Params = Record<string, string | number | boolean | undefined>;
