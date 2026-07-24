export const API_BASE_URL = 'https://www.zhaotool.com';

export const REQUEST_TIMEOUT = 10000;

export const HTTP_STATUS = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络异常，请检查网络连接',
  TIMEOUT_ERROR: '请求超时，请稍后重试',
  SERVER_ERROR: '服务器异常，请稍后重试',
  UNKNOWN_ERROR: '未知错误'
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo'
} as const;
