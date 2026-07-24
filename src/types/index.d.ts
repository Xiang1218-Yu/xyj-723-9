declare namespace WechatMiniprogram {
  interface App {
    globalData: GlobalData;
  }
}

interface GlobalData {
  g_isPlayingMusic: boolean;
  g_currentMusicPostId: number | null;
  gwapi: string;
  systemInfo?: WechatMiniprogram.SystemInfo;
}

interface Currency {
  name: string;
  description: string;
  comments: string;
}

interface BannerItem {
  id: number;
  imageUrl: string;
  linkUrl?: string;
  title?: string;
}

interface AdText {
  text: string;
}

interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: Record<string, unknown>;
  header?: Record<string, string>;
  timeout?: number;
}

interface PerformanceMetrics {
  pageLoadTime: number;
  firstRenderTime: number;
  apiResponseTime: Record<string, number>;
}

interface ErrorLog {
  type: 'jsError' | 'apiError' | 'resourceError' | 'pageError';
  message: string;
  stack?: string;
  url?: string;
  timestamp: number;
  extra?: Record<string, unknown>;
}
