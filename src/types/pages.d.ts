export interface HomePageData {
  banner: BannerItem[] | null;
  autoplay: boolean;
  interval: number;
  duration: number;
  txtAds: string | null;
  advertise: unknown;
}

export interface ExchangeCalPageData {
  allDataList: CurrencyListData;
  debitList: Currency[];
  rate: string;
  calResult: string;
  dateStr: string;
  tradeCurrency: Currency;
  debitCurrency: Currency;
  debitArray: string[];
  index: number;
  date: string;
  errorFlag: boolean;
  rateTextFlag: boolean;
}

export interface IdcardPageData {
  movies: unknown[];
  q: string;
  idcard: boolean;
  bank: boolean;
  phone: boolean;
  nodata: boolean;
  init: boolean;
  inrequest: boolean;
  phonedata: Record<string, unknown>;
  idcarddata: Record<string, unknown>;
  bankdata: Record<string, unknown>;
}

export interface Currency {
  name: string;
  description: string;
  comments: string;
  firstLetter?: string;
  icon?: string;
}

export interface CurrencyListData {
  charge: Currency[];
  trade: {
    all: Record<string, Currency[]>;
    hot: Currency[];
  };
}

export interface BannerItem {
  id: number;
  imageUrl: string;
  linkUrl?: string;
  title?: string;
}

export namespace HomePage {
  function setBanner(): void;
  function setTxtAds(): void;
  function toidcard(): void;
  function toexp(): void;
  function tohuilv(): void;
  function onLoad(): void;
  function onShareAppMessage(): {
    title: string;
    path: string;
  };
}

export namespace ExchangeCalPage {
  function onReady(): void;
  function onShow(): void;
  function onUnload(): void;
  function getDateStr(): string;
  function fetchRate(): void;
  function calInput(e: WechatMiniprogram.Input): void;
  function doCal(value: string): void;
  function changeTrans(): void;
  function bindPickerChange(e: WechatMiniprogram.PickerChange): void;
  function bindDateChange(e: WechatMiniprogram.PickerChange): void;
}
