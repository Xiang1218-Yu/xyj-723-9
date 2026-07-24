"use strict";
/**
 * 全局运行时配置
 * @module config
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TIMEOUT = exports.config = exports.ENV = void 0;
/** 当前环境：可由构建时替换或按 accountInfo 判断 */
exports.ENV = typeof wx !== 'undefined' &&
    wx.getAccountInfoSync &&
    wx.getAccountInfoSync().miniProgram.envVersion === 'release'
    ? 'production'
    : 'development';
const configMap = {
    development: {
        baseURL: 'https://www.zhaotool.com',
        cdnBaseURL: 'https://cdn.zhaotool.com/miniprogram',
        reportURL: 'https://www.zhaotool.com/v1/monitor/report',
    },
    production: {
        baseURL: 'https://www.zhaotool.com',
        cdnBaseURL: 'https://cdn.zhaotool.com/miniprogram',
        reportURL: 'https://www.zhaotool.com/v1/monitor/report',
    },
};
exports.config = configMap[exports.ENV];
/** 默认请求超时（毫秒） */
exports.DEFAULT_TIMEOUT = 10000;
//# sourceMappingURL=index.js.map