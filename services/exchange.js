"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrencyList = exports.fetchExchangeRate = exports.fetchTextAd = exports.fetchBanners = void 0;
const request_1 = require("./request");
const index_1 = require("../constants/index");
/**
 * 获取首页 Banner 列表
 */
function fetchBanners() {
    return request_1.http.get(index_1.API_PATHS.BANNER);
}
exports.fetchBanners = fetchBanners;
/**
 * 获取文字广告
 */
function fetchTextAd() {
    return request_1.http.get(index_1.API_PATHS.AD_TEXT);
}
exports.fetchTextAd = fetchTextAd;
/**
 * 获取汇率
 * @param debitCurrency 扣账币种代码 (如 CNY)
 * @param tradeCurrency 交易币种代码 (如 USD)
 * @param date 日期 YYYY-MM-DD
 */
function fetchExchangeRate(debitCurrency, tradeCurrency, date) {
    return request_1.http.get(`${index_1.API_PATHS.EXCHANGE_RATE}/${debitCurrency}/${tradeCurrency}/${date}`);
}
exports.fetchExchangeRate = fetchExchangeRate;
/**
 * 获取货币列表（静态数据，从本地配置读取）
 */
function getCurrencyList() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const list = require('../untils/list.js');
    return list.allDataList;
}
exports.getCurrencyList = getCurrencyList;
//# sourceMappingURL=exchange.js.map