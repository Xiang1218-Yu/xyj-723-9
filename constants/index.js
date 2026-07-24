"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBPACKAGES = exports.MONITOR_DEFAULTS = exports.REQUEST_DEFAULTS = exports.DEFAULT_CURRENCIES = exports.QUERY_SID_MAP = exports.API_PATHS = exports.STORAGE_KEYS = void 0;
/**
 * 存储 Key 常量
 */
exports.STORAGE_KEYS = {
    INPUT_AMOUNT: 'input',
    TRADE_CURRENCY: 'tradeCurrency',
    DEBIT_CURRENCY: 'debitCurrency',
    EXPRESS_HISTORY_PREFIX: 'TN::',
    PERFORMANCE_METRICS: 'perf_metrics',
    ERROR_QUEUE: 'error_queue',
    USER_TOKEN: 'user_token',
};
/**
 * API 路径常量
 */
exports.API_PATHS = {
    BANNER: '/v1/h/images',
    AD_TEXT: '/v1/wx/adText',
    EXCHANGE_RATE: '/v1/wx/huobi',
    QUERY_INFO: '/v1/wx/info',
    EXPRESS_INFO: '/v1/exp/info',
};
/**
 * 查询类型 SID 映射
 */
exports.QUERY_SID_MAP = {
    S100: 'bank',
    S101: 'phone',
    S102: 'idcard',
};
/**
 * 默认货币配置
 */
exports.DEFAULT_CURRENCIES = {
    trade: {
        name: '美元',
        description: 'USD',
        comments: 'U.S.Dollar',
    },
    debit: {
        name: '人民币',
        description: 'CNY',
        comments: 'Yuan Renminbi',
    },
};
/**
 * 请求默认配置
 */
exports.REQUEST_DEFAULTS = {
    TIMEOUT: 10000,
    RETRY_COUNT: 2,
    RETRY_DELAY: 1000,
    LOADING_TEXT: '加载中...',
};
/**
 * 监控配置
 */
exports.MONITOR_DEFAULTS = {
    PERF_SAMPLE_RATE: 1,
    ERROR_SAMPLE_RATE: 1,
    MAX_QUEUE_SIZE: 20,
    FLUSH_INTERVAL: 5000,
    MAX_METRICS_STORED: 50,
};
/**
 * 子包名称
 */
exports.SUBPACKAGES = {
    EXCHANGE: 'package-exchange',
    QUERY: 'package-query',
    EXPRESS: 'package-express',
};
//# sourceMappingURL=index.js.map