import { http } from './request';
import { API_PATHS } from '../constants/index';
import type { Currency, ExchangeRateData, BannerItem, TextAdData } from '../types/index';

/**
 * 获取首页 Banner 列表
 */
export function fetchBanners(): Promise<BannerItem[]> {
  return http.get<BannerItem[]>(API_PATHS.BANNER);
}

/**
 * 获取文字广告
 */
export function fetchTextAd(): Promise<TextAdData> {
  return http.get<TextAdData>(API_PATHS.AD_TEXT);
}

/**
 * 获取汇率
 * @param debitCurrency 扣账币种代码 (如 CNY)
 * @param tradeCurrency 交易币种代码 (如 USD)
 * @param date 日期 YYYY-MM-DD
 */
export function fetchExchangeRate(
  debitCurrency: string,
  tradeCurrency: string,
  date: string,
): Promise<ExchangeRateData> {
  return http.get<ExchangeRateData>(
    `${API_PATHS.EXCHANGE_RATE}/${debitCurrency}/${tradeCurrency}/${date}`,
  );
}

/**
 * 获取货币列表（静态数据，从本地配置读取）
 */
export function getCurrencyList(): {
  charge: Currency[];
  trade: { all: Record<string, Currency[]>; hot: Currency[] };
} {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const list = require('../untils/list.js');
  return list.allDataList as {
    charge: Currency[];
    trade: { all: Record<string, Currency[]>; hot: Currency[] };
  };
}
