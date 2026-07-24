var common = require('../../../untils/exputil.js');
var app = getApp()
Page({
  data: {
    histories: [],
    result: {},
    trans:{},
    tracking: false,
    historyLongTouch: false
  },
  onShareAppMessage: function () {
    return {
      title: '国际包裹查询工具',
      desc: '',
      path: '/pages/exp/index/index'
    }
  },
  callTrackApi(num) {
    var that = this;
    that.setData({
      tracking: true
    });
    wx.request({
      url: app.globalData.gwapi + '/v1/exp/info/' + num,
      data: {},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        that.setData({
          trans: res.data.data.trans
        });
        that.setData({
          tracking: false
        });
        that.setData({
          result: res.data
        });
        
        console.log(res.data);

        return;
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

  },
  track: function (e) {
    this.toTrackPage(e.detail.value);
  },
  historyTouchstart: function (e) {
    this.setData({
      historyLongTouch: false
    });
  },
  trackHistory: function (e) {
    if (this.data.historyLongTouch) {
      return;
    }

    this.toTrackPage(e.currentTarget.dataset.number);
  },
  scanNumber: function (e) {
    var that=this;
    console.log("扫码结果"+JSON.stringify(e));
    wx.scanCode({
      success: function (res) {
        console.log("扫码结果" + JSON.stringify(res));
        that.toTrackPage(res.result);
      }
    })
  },
  toTrackPage(number) {
    if (!number) {
      wx.showToast({
        title: '输入不能为空。',
        duration: 1500,
        icon: 'warn'
      });

      return;
    }
    this.callTrackApi(number);
  },
  showActon: function (e) {
    this.setData({
      historyLongTouch: true
    });

    var that = this,
      n = e.currentTarget.dataset.number;
    wx.showActionSheet({
      itemList: ['删除'],
      itemColor: 'red',
      success: function (res) {
        if (res.tapIndex === 0) {
          try {
            var histories = [],
              removeKey = null;
            for (var i in that.data.histories) {
              var item = that.data.histories[i];
              if (item.TrackingNumber !== n) {
                histories.push(item);
              } else {
                removeKey = item.unique;
              }
            }
            that.setData({
              'histories': histories
            });

            if (removeKey) {
              wx.removeStorageSync(removeKey);
            }
          } catch (e) {}
        }
      }
    });
  },
  onShow: function () {
    var that = this;
    try {
      var res = wx.getStorageInfoSync(),
        keys = res.keys,
        histories = [];

      for (var i in keys.reverse()) {
        var key = keys[i]

        if (!key.startsWith('TN::')) {
          continue;
        }

        try {
          var data = wx.getStorageSync(key);
          if (data) {
            data.unique = key;

            var trackStateStyle = common.trackStateStyle(data.Status);
            data.css = trackStateStyle.css;
            data.iconType = trackStateStyle.iconType;

            histories.push(data);
          }
        } catch (e) {
          //
        }
      }

      that.setData({
        histories: histories
      });
    } catch (e) {
      //
    }
  }
});

