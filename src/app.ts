/**
 * 小程序入口。工程化改造后由 TypeScript 编写，编译产物覆盖 app.js。
 * @module app
 */
import { initMonitor } from './monitor/index';
import type { Currency } from './types';

/** App 全局数据结构 */
interface IGlobalData {
  g_isPlayingMusic: boolean;
  g_currentMusicPostId: string | null;
  /** 接口网关地址（保留向后兼容，新代码请使用 config.baseURL） */
  gwapi: string;
}

interface IAppOption {
  globalData: IGlobalData;
  tradeCurrency: Currency;
  debitCurrency: Currency;
  launchStart: number;
}

App<IAppOption>({
  launchStart: Date.now(),
  globalData: {
    g_isPlayingMusic: false,
    g_currentMusicPostId: null,
    gwapi: 'https://www.zhaotool.com',
  },
  tradeCurrency: {
    name: '美元',
    description: 'USD',
    comments: 'U.S.Dollar',
  },
  debitCurrency: {
    name: '人民币',
    description: 'CNY',
    comments: 'Yuan Renminbi',
  },
  onLaunch() {
    // 初始化性能与错误监控
    initMonitor(this.launchStart);
  },
  onError(err: string) {
    // 转发到监控体系（App 级兜底）
    import('./monitor/index').then(({ report }) => {
      report({ type: 'error', name: 'appError', extra: { message: err } });
    });
  },
});
