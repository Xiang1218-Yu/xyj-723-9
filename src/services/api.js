const { http } = require('./request');

const homeApi = {
  getBanners() {
    return http.get('/v1/h/images');
  },
  getAdText() {
    return http.get('/v1/wx/adText');
  }
};

const currencyApi = {
  getCurrencyList() {
    return http.get('/v1/currency/list');
  },
  getExchangeRate(from, to, date) {
    return http.get(`/v1/wx/huobi/${from}/${to}/${date || ''}`);
  },
  queryInfo(q) {
    return http.post('/v1/wx/info', { q });
  }
};

const expressApi = {
  queryExpress(company, number) {
    return http.get('/v1/express/query', { company, number });
  }
};

const idcardApi = {
  queryIdcard(idcard) {
    return http.get('/v1/idcard/query', { idcard });
  }
};

const api = {
  home: homeApi,
  currency: currencyApi,
  express: expressApi,
  idcard: idcardApi
};

module.exports = {
  homeApi,
  currencyApi,
  expressApi,
  idcardApi,
  api
};
