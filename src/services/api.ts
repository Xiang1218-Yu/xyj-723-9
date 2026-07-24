import { http } from './request';

interface BannerItem {
  id: number;
  imageUrl: string;
  linkUrl?: string;
  title?: string;
}

interface AdText {
  text: string;
}

export const homeApi = {
  getBanners: () => http.get<BannerItem[]>('/v1/h/images'),
  getAdText: () => http.get<AdText>('/v1/wx/adText')
};

interface CurrencyInfo {
  code: string;
  name: string;
  rate: number;
}

export const currencyApi = {
  getCurrencyList: () => http.get<CurrencyInfo[]>('/v1/currency/list'),
  getExchangeRate: (from: string, to: string) =>
    http.get<{ rate: number }>('/v1/currency/rate', { from, to })
};

export const expressApi = {
  queryExpress: (company: string, number: string) =>
    http.get('/v1/express/query', { company, number })
};

export const idcardApi = {
  queryIdcard: (idcard: string) => http.get('/v1/idcard/query', { idcard })
};

export const api = {
  home: homeApi,
  currency: currencyApi,
  express: expressApi,
  idcard: idcardApi
};
