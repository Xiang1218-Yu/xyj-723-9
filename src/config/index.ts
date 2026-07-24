/**
 * 全局运行时配置
 * @module config
 */

/** 环境类型 */
export type EnvType = 'development' | 'production';

/** 当前环境：可由构建时替换或按 accountInfo 判断 */
export const ENV: EnvType =
  typeof wx !== 'undefined' &&
  wx.getAccountInfoSync &&
  wx.getAccountInfoSync().miniProgram.envVersion === 'release'
    ? 'production'
    : 'development';

interface EnvConfig {
  /** 接口基础地址 */
  baseURL: string;
  /** 静态资源 CDN 基础地址 */
  cdnBaseURL: string;
  /** 监控上报地址 */
  reportURL: string;
}

const configMap: Record<EnvType, EnvConfig> = {
  development: {
    baseURL: 'https://www.zhaotool.com',
    cdnBaseURL: 'https://cdn.zhaotool.com/miniprogram',
    reportURL: 'https://www.zhaotool.com/v1/monitor/report',
  },
  production: {
    baseURL: 'https://www.zhaotool.com',
    cdnBaseURL: 'https://cdn.zhaotool.com/miniprogram',
    reportURL: 'https://www.zhaotool.com/v1/monitor/report',
  },
};

export const config: EnvConfig = configMap[ENV];

/** 默认请求超时（毫秒） */
export const DEFAULT_TIMEOUT = 10000;
