/**
 * 应用全局数据
 */
export interface GlobalData {
  g_isPlayingMusic: boolean;
  g_currentMusicPostId: number | null;
  gwapi: string;
  systemInfo?: WechatMiniprogram.SystemInfo;
  cdnBaseUrl?: string;
}

/**
 * 环境类型
 */
export type EnvType = 'development' | 'staging' | 'production';

/**
 * 环境配置
 */
export interface EnvConfig {
  env: EnvType;
  apiBaseUrl: string;
  cdnBaseUrl: string;
  reportUrl: string;
  debug: boolean;
  enableMock: boolean;
}

/**
 * Tab Bar 页面项
 */
export interface TabBarItem {
  pagePath: string;
  text: string;
  iconPath: string;
  selectedIconPath: string;
}

/**
 * 子包配置
 */
export interface SubpackageConfig {
  root: string;
  name: string;
  pages: string[];
  independent?: boolean;
}

/**
 * 应用实例
 */
export interface AppInstance {
  globalData: GlobalData;
  tradeCurrency: import('./exchange').Currency;
  debitCurrency: import('./exchange').Currency;
}
