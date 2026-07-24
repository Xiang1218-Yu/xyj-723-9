var monitor = require('./monitor/index.js');

App({
  globalData: {
    g_isPlayingMusic: false,
    g_currentMusicPostId: null,
    gwapi: 'https://www.zhaotool.com',
    systemInfo: null,
    cdnBaseUrl: '',
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
  onLaunch: function () {
    var self = this;
    try {
      self.globalData.systemInfo = wx.getSystemInfoSync();
    } catch (e) {
      console.error('Failed to get system info', e);
    }

    if (monitor.initMonitor) {
      monitor.initMonitor();
    }

    if (monitor.perfMonitor) {
      monitor.perfMonitor.markAppLaunch();
    }
  },
  onShow: function () {
    // app shown
  },
  onHide: function () {
    if (monitor.perfMonitor) {
      monitor.perfMonitor.flush();
    }
  },
  onError: function (msg) {
    if (monitor.errorMonitor) {
      monitor.errorMonitor.captureError(msg);
    }
  },
  onUnhandledRejection: function (res) {
    if (monitor.errorMonitor) {
      monitor.errorMonitor.captureError(
        res.reason instanceof Error ? res.reason : new Error(String(res.reason)),
      );
    }
  },
});
