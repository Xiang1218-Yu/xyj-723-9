/**
 * 货币与汇率相关类型
 * @module types/currency
 */

/** 单个货币信息 */
export interface Currency {
  /** 中文名称，如 "人民币" */
  name: string;
  /** ISO 货币代码，如 "CNY" */
  description: string;
  /** 英文全称，如 "Yuan Renminbi" */
  comments: string;
  /** 首字母，用于列表分组 */
  firstLetter?: string;
  /** 图标相对路径 */
  icon?: string;
}

/** 货币列表数据结构（untils/list.js 对应） */
export interface AllDataList {
  /** 可作为扣账（本位）币种列表 */
  charge: Currency[];
  /** 交易币种 */
  trade: {
    /** 按首字母分组的全部币种 */
    all: Record<string, Currency[]>;
    /** 热门币种 */
    hot: Currency[];
  };
}

/** 汇率接口返回的数据体 */
export interface RateData {
  /** 汇率值（字符串，需 parseFloat 转换） */
  rate: string;
  /** 数据日期 */
  date?: string;
}
