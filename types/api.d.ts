/**
 * API 响应基础结构
 */
export interface ApiResponse<T = unknown> {
  code: string;
  message?: string;
  data: T;
  sid?: string;
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * 分页响应数据
 */
export interface PaginatedData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * HTTP 请求方法
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * 请求配置选项
 */
export interface RequestOptions {
  url: string;
  method?: HttpMethod;
  data?: Record<string, unknown> | string;
  header?: Record<string, string>;
  timeout?: number;
  loading?: boolean;
  showError?: boolean;
  retry?: number;
  retryDelay?: number;
}

/**
 * 请求拦截器
 */
export type RequestInterceptor = (
  options: RequestOptions,
) => RequestOptions | Promise<RequestOptions>;

/**
 * 响应拦截器
 */
export type ResponseInterceptor<T = unknown> = (
  response: WechatMiniprogram.RequestSuccessCallbackResult<T>,
) => T | Promise<T>;

/**
 * 错误响应
 */
export interface RequestError extends Error {
  statusCode?: number;
  code?: string;
  data?: unknown;
  url?: string;
  method?: string;
}
