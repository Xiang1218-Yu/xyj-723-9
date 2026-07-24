import { setReportUrl, reportPerformance } from './src/monitor';

App({
  globalData: {
    g_isPlayingMusic: false,
    g_currentMusicPostId: null,
    gwapi: 'https://www.zhaotool.com',
    systemInfo: null as WechatMiniprogram.SystemInfo | null
  } as GlobalData,
  tradeCurrency: {
    name: '美元',
    description: 'USD',
    comments: 'U.S.Dollar'
  } as Currency,
  debitCurrency: {
    name: '人民币',
    description: 'CNY',
    comments: 'Yuan Renminbi'
  } as Currency,

  onLaunch() {
    console.log('App Launch');
    this.initMonitor();
    this.collectSystemInfo();
  },

  onShow() {
    console.log('App Show');
  },

  onHide() {
    console.log('App Hide');
  },

  onError(msg: string) {
    console.error('App Error:', msg);
  },

  initMonitor() {
    setReportUrl('');
  },

  collectSystemInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      this.globalData.systemInfo = systemInfo;
      reportPerformance('app_launch', Date.now(), {
        platform: systemInfo.platform,
        system: systemInfo.system,
        version: systemInfo.version
      });
    } catch (e) {
      console.warn('Get system info failed');
    }
  }
});
