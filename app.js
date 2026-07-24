const monitor = require('./src/monitor/index.js');

App({
  globalData: {
    g_isPlayingMusic: false,
    g_currentMusicPostId: null,
    gwapi: 'https://www.zhaotool.com',
    systemInfo: null
  },
  tradeCurrency: {
    name: '美元',
    description: 'USD',
    comments: 'U.S.Dollar'
  },
  debitCurrency: {
    name: '人民币',
    description: 'CNY',
    comments: 'Yuan Renminbi'
  },

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

  onError(msg) {
    console.error('App Error:', msg);
  },

  initMonitor() {
    monitor.setReportUrl('');
  },

  collectSystemInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      this.globalData.systemInfo = systemInfo;
      monitor.reportPerformance('app_launch', Date.now(), {
        platform: systemInfo.platform,
        system: systemInfo.system,
        version: systemInfo.version
      });
    } catch (e) {
      console.warn('Get system info failed');
    }
  }
});
