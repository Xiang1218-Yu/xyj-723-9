"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 小程序入口。工程化改造后由 TypeScript 编写，编译产物覆盖 app.js。
 * @module app
 */
const index_1 = require("./monitor/index");
App({
    launchStart: Date.now(),
    globalData: {
        g_isPlayingMusic: false,
        g_currentMusicPostId: null,
        gwapi: 'https://www.zhaotool.com',
    },
    tradeCurrency: {
        name: '美元',
        description: 'USD',
        comments: 'U.S.Dollar',
    },
    debitCurrency: {
        name: '人民币',
        description: 'CNY',
        comments: 'Yuan Renminbi',
    },
    onLaunch() {
        // 初始化性能与错误监控
        (0, index_1.initMonitor)(this.launchStart);
    },
    onError(err) {
        // 转发到监控体系（App 级兜底）
        Promise.resolve().then(() => __importStar(require('./monitor/index'))).then(({ report }) => {
            report({ type: 'error', name: 'appError', extra: { message: err } });
        });
    },
});
//# sourceMappingURL=app.js.map