const app = getApp();
const { homeApi } = require('../../src/services/api.js');
const { pageStart, pageEnd } = require('../../src/monitor/index.js');

Page({
  data: {
    banner: null,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    txtAds: null,
    advertise: null
  },

  setBanner() {
    const that = this;
    homeApi
      .getBanners()
      .then(data => {
        that.setData({
          banner: data
        });
      })
      .catch(err => {
        console.error('获取banner失败:', err);
      });
  },

  setTxtAds() {
    const that = this;
    homeApi
      .getAdText()
      .then(data => {
        that.setData({
          txtAds: data.text
        });
      })
      .catch(err => {
        console.error('获取广告文案失败:', err);
      });
  },

  toidcard() {
    wx.navigateTo({
      url: '/packageTools/pages/idcard/idcard'
    });
  },

  toexp() {
    wx.navigateTo({
      url: '/packageTools/pages/exp/index/index'
    });
  },

  tohuilv() {
    wx.navigateTo({
      url: '/packageTools/pages/exchangeCal/exchangeCal'
    });
  },

  setModule() {},

  onLoad() {
    const startTime = Date.now();
    pageStart('nindex');
    this.setBanner();
    this.setTxtAds();
    this.setModule();
    wx.showShareMenu({
      withShareTicket: true
    });
    pageEnd('nindex', startTime);
  },

  onShareAppMessage() {
    return {
      title: '搜【爱乐查】',
      path: '/pages/nindex/index',
      success() {},
      fail() {}
    };
  }
});
