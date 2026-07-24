const list = require('../../../untils/list.js');
const { currencyApi } = require('../../../src/services/api.js');
const { reportError } = require('../../../src/monitor/index.js');

const allDataList = list.allDataList;
const app = getApp();

Page({
  data: {
    allDataList,
    debitList: '',
    rate: '',
    calResult: '',
    dateStr: '',
    tradeCurrency: {},
    debitCurrency: {},
    debitArray: [],
    index: 0,
    date: '',
    errorFlag: true,
    rateTextFlag: true
  },

  onReady() {
    const dateStr = this.getDateStr();
    const debitList = this.debitList();
    const debitArray = this.debitArray(debitList);
    this.setData({
      dateStr,
      tradeCurrency: app.tradeCurrency,
      debitCurrency: app.debitCurrency,
      debitList,
      debitArray,
      date: dateStr
    });
    wx.clearStorage();
    this.fetchRate();
  },

  onShow() {
    this.setData({
      tradeCurrency: app.tradeCurrency
    });
    this.fetchRate();
  },

  onUnload() {
    wx.clearStorage();
  },

  getDateStr() {
    const nowDate = new Date();
    const nowDateMonth = (month => (month < 10 ? `0${month}` : month))(nowDate.getMonth() + 1);
    const nowDateDay = (day => (day < 10 ? `0${day}` : day))(nowDate.getDate());
    return `${nowDate.getFullYear()}-${nowDateMonth}-${nowDateDay}`;
  },

  debitList() {
    return allDataList.charge;
  },

  debitArray(list) {
    const retArray = [];
    for (const i in list) {
      retArray[i] = `${list[i].name} ${list[i].description} ${list[i].comments}`;
    }
    return retArray;
  },

  fetchRate() {
    const { date, debitCurrency, tradeCurrency } = this.data;
    if (date && debitCurrency && tradeCurrency) {
      currencyApi
        .getExchangeRate(debitCurrency.description, tradeCurrency.description, date)
        .then(data => {
          const realRateValue = parseFloat(data.rate);
          if (realRateValue) {
            this.setData({
              rate: data.rate,
              rateTextFlag: false
            });
            wx.getStorage({
              key: 'input',
              success: res => {
                this.doCal(res.data);
              },
              fail() {}
            });
          } else {
            this.showError();
          }
        })
        .catch(err => {
          reportError('apiError', { message: '获取汇率失败' }, err);
          this.showError();
        });
    }
  },

  showError() {
    this.setData({
      rateTextFlag: true,
      errorFlag: false
    });
    setTimeout(() => {
      this.setData({
        errorFlag: true
      });
    }, 3000);
  },

  calInput(e) {
    const value = e.detail.value;
    wx.setStorage({
      key: 'input',
      data: value
    });
    this.doCal(value);
  },

  doCal(value) {
    const amount = value;
    if (amount !== '') {
      const result = parseFloat((this.data.rate * amount).toFixed(2));
      this.setData({
        calResult: result
      });
    } else {
      this.setData({
        calResult: ''
      });
    }
  },

  changeTrans() {
    wx.navigateTo({
      url: '../currencyList/currencyList'
    });
  },

  bindPickerChange(e) {
    const i = e.detail.value;
    this.setData({
      index: i,
      debitCurrency: {
        name: this.data.debitList[i].name,
        description: this.data.debitList[i].description,
        comments: this.data.debitList[i].comments
      }
    });
    this.fetchRate();
  },

  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    });
    this.fetchRate();
  }
});
