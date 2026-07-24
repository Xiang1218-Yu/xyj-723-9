var app = getApp()
Page({
  data: {
    q: '',
    idcard: false,
    bank: false,
    phone: false,
    nodata: false,
    inrequest: false,
    phonedata: {},
    idcarddata: {},
    bankdata: {}
  },
  onLoad: function (option) {
    var q = option.q;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 800
    })
    wx.request({
      url: app.globalData.gwapi + '/v1/wx/info',
      data: { "q": q },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        if (res.data.sid == 'S100') {
          that.setData({ bankdata: res.data.data, bank: true });
        }
        if (res.data.sid == 'S101') {
          that.setData({ phonedata: res.data.data, phone: true });
        }
        if (res.data.sid == 'S102') {
          that.setData({ idcarddata: res.data.data, idcard: true });
        }
        if (res.data.code != '0') {
          wx.showToast({
            title: '无数据',
            icon: 'success',
            duration: 1200
          })
        }
        that.setData({ nodata: true });

        console.log(res.data);
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  iquery: function (e) {

    this.setData({
      q: e.detail.value,
      idcard: false,
      bank: false,
      phone: false
    })
  },
  search: function () {
    var that = this;
    var q = this.data.q;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 800
    })
    wx.request({
      url: app.globalData.gwapi + '/v1/wx/info',
      data: { "q": q },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        if (res.data.sid == 'S100') {
          that.setData({ bankdata: res.data.data, bank: true });
        }
        if (res.data.sid == 'S101') {
          that.setData({ phonedata: res.data.data, phone: true });
        }
        if (res.data.sid == 'S102') {
          that.setData({ idcarddata: res.data.data, idcard: true });
        }
        if (res.data.code != '0') {
          wx.showToast({
            title: '无数据',
            icon: 'success',
            duration: 1200
          })
        }
        that.setData({ nodata: true });

        console.log(res.data);
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
})  