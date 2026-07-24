var app = getApp()
function convertToStarsArray(stars){
  var num=stars.toString().substring(0,1)
  var array=[];
  for(var i=1;i<=5;i++){
    if(i<=num){
      array.push(1);
    }else{
      array.push(0)
    }
  }
  return array;
}
function formatTime(date) {
  var year = new Date(date).getFullYear()
  var month = new Date(date).getMonth() + 1
  var day = new Date(date).getDate()

  var hour = new Date(date).getHours()
  var minute = new Date(date).getMinutes()
  var second = new Date(date).getSeconds();


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function http(url,callBack) {
  var _this = this
  wx.request({
    url: url,
    data: {},
    header: {
      "Content-Type": "json"
    },
    method: 'GET',
    success: function (res) {
      callBack(res.data)
    },
    fail: function () {
      console.log('failed')
    }
  })
}

//演员名字拼接
function convertToCastString(casts){
  var castsjoin='';
  for(var index in casts){
    castsjoin=castsjoin+casts[index].name+"/";
  }
  return castsjoin.substring(0,castsjoin.length-2);
}

function converToCastInfos(casts){
  var castsArray=[];
  for(var index in casts){
    var cast={
      img: casts[index].avatars ? casts[index].avatars.large : "",
      name:casts[index].name
    }
    castsArray.push(cast)
  }
  return castsArray;
}
//网络访问  
function getBanner(callback) {
  var _this = this
  wx.request({
    url: app.globalData.gwapi + '/v1/h/images',
    data: {
    },
    method: 'GET',
    header: { 'content-Type': 'application/json' },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    },
    fail:function(res){
      console.log(res);
    }
  })
}
function fetchURL(url, callBack) {
  var _this = this
  wx.request({
    url: url,
    data: {},
    header: {
      "Content-Type": "json"
    },
    method: 'GET',
    success: function (res) {
      callBack(res.data)
    },
    fail: function () {
      console.log('failed')
    }
  })
}

module.exports={
  convertToStarsArray:convertToStarsArray,
  formatTime: formatTime,
  formatNumber: formatNumber,
  http:http,
  fetch: fetchURL,
  convertToCastString: convertToCastString,
  getBanner: getBanner,
  converToCastInfos: converToCastInfos
}