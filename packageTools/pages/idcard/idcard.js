const { currencyApi } = require('../../../src/services/api.js');
const { pageStart, pageEnd, reportError } = require('../../../src/monitor/index.js');

Page({
  data: {
    movies: [],
    q: '',
    idcard: false,
    bank: false,
    phone: false,
    nodata: false,
    init: true,
    inrequest: false,
    phonedata: {},
    idcarddata: {},
    bankdata: {}
  },

  onLoad() {
    const startTime = Date.now();
    pageStart('idcard');
    wx.showShareMenu({
      withShareTicket: true
    });
    pageEnd('idcard', startTime);
  },

  onShareAppMessage() {
    return {
      title: '查归属，搜【爱乐查】',
      path: '/pages/nindex/index',
      success() {},
      fail() {}
    };
  },

  qput(e) {
    this.setData({
      q: e.detail.value
    });
  },

  iquery(e) {
    this.setData({
      q: e.detail.value,
      idcard: false,
      bank: false,
      phone: false
    });
  },

  clearch() {
    this.setData({
      q: '',
      bankdata: '',
      idcarddata: '',
      phonedata: ''
    });
  },

  search() {
    const q = this.data.q;
    const that = this;

    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 200
    });

    currencyApi
      .queryInfo(q)
      .then(res => {
        if (res.sid === 'S100') {
          wx.showToast({
            title: res.data.bankName,
            icon: 'success',
            duration: 1200
          });
          that.setData({ bankdata: res.data, bank: true });
        }
        if (res.sid === 'S101') {
          that.setData({ phonedata: res.data, phone: true });
        }
        if (res.sid === 'S102') {
          that.setData({ idcarddata: res.data, idcard: true });
        }
        if (res.code !== '0') {
          wx.showToast({
            title: res.msg,
            icon: 'success',
            duration: 800
          });
        }
      })
      .catch(err => {
        reportError('apiError', { message: '查询失败' }, err);
        wx.showToast({
          title: '查询失败，请重试',
          icon: 'none',
          duration: 1000
        });
      });
  }
});
