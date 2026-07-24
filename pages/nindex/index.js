//index.js
//获取应用实例
var app = getApp()
var util = require('../../untils/untils.js')  

Page({
  data: {
    banner: null,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    txtAds: null,
    advertise: null
  },
  /*
  * 首页banner
  */
  setBanner: function () {
    let that = this;
    util.fetch(app.globalData.gwapi + '/v1/h/images', function (data) {
      that.setData({
        banner: data.data
      });
    });
  },
  /**
   * 首页文字广告
   */
  setTxtAds: function () {
    let that = this;
    util.fetch(app.globalData.gwapi + '/v1/wx/adText', function (data) {
      that.setData({
        txtAds: data.data.text
      });
    });
  },
  /**
   * 首页两块子banner
   */
  // setSubBanner: function(){
  //   let that = this;
  //   util.fetch('http://api.cyb.kuaiqiangche.com/event/advertise/index', function (data) {
  //     that.setData({
  //       advertise: data.data
  //     });
  //   });
  // },
  toidcard: function () {
    wx.navigateTo({
      url: '../idcard/idcard'
    })
  },
  toexp:function(){
    wx.navigateTo({
      url: '../exp/index/index'
    })
  },
  tohuilv:function(){
    wx.navigateTo({
      url: '../exchangeCal/exchangeCal'
    })
  },
  /**
   * 模块入口
   */
  setModule: function(){

  },
  /**
   * 入口
   */
  onLoad: function () {
    var that = this;
    that.setBanner();
    that.setTxtAds();
    // that.setSubBanner();
    that.setModule();
    wx.showShareMenu({
      withShareTicket: true
    })  
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '搜【爱乐查】',
      path: '/pages/nindex/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
   
});