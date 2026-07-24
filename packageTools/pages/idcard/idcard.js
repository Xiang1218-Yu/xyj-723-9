var app = getApp()
var util = require('../../untils/untils.js')  
Page({
  data: {
    movies: [
     
    ],
    q:'',
    idcard: false,
    bank: false,
    phone: false,
    nodata:false,
    init:true,
    inrequest:false,
    phonedata:{},
    idcarddata:{},
    bankdata:{}
  },
  onLoad: function () {
    var that = this;
    //网络访问，获取轮播图的图片  
    util.getBanner(function (data) {
      that.setData({
        movies: data.data
      })
    }); 
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
      title: '查归属，搜【爱乐查】',
      path: '/pages/home/home',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  qput: function (e) {
    this.setData({
      q: e.detail.value
    })
  },
  iquery: function (e) {
    this.setData({
      q: e.detail.value,
      idcard:false,
      bank: false,
      phone: false
    })
  },
  clearch:function(){
    this.setData({
      q: '',
      bankdata:'',
      idcarddata: '',
      phonedata: '',
    })
    return;
  },
  search: function () {
    var that = this;
    var q = this.data.q;
  
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 200
    })
      wx.request({
        url: app.globalData.gwapi +'/v1/wx/info',
        data: {"q":q},
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function (res) {
          if(res.data.sid=='S100'){
            wx.showToast({
              title: res.data.data.bankName,
              icon: 'success',
              duration: 1200
            })
            that.setData({ bankdata: res.data.data, bank: true });
          }
          if (res.data.sid == 'S101') {
            that.setData({ phonedata: res.data.data, phone: true });
          }
          if (res.data.sid == 'S102') {
            that.setData({ idcarddata: res.data.data, idcard: true  });
          }
          if (res.data.code!='0'){
              wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 800
              })
          }
        // that.setData({init:false });
        
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
})  