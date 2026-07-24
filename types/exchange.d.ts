/**
 * 货币信息
 */
export interface Currency {
  name: string;
  description: string;
  comments: string;
  firstLetter?: string;
  icon?: string;
}

/**
 * 汇率数据
 */
export interface ExchangeRate {
  rate: string;
  date: string;
  debitCurrency: Currency;
  tradeCurrency: Currency;
}

/**
 * 汇率API返回数据
 */
export interface ExchangeRateData {
  rate: string;
  time?: string;
}

/**
 * 汇率计算结果
 */
export interface ExchangeResult {
  amount: number;
  rate: string;
  result: string;
  date: string;
}

/**
 * 货币分组列表
 */
export interface CurrencyListData {
  charge: Currency[];
  trade: {
    all: Record<string, Currency[]>;
    hot: Currency[];
  };
}

/**
 * Banner 数据
 */
export interface BannerItem {
  image: string;
  target: string;
  id?: string | number;
}

/**
 * 文字广告数据
 */
export interface TextAdData {
  text: string;
}
