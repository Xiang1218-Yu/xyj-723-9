"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentEnv = exports.getConfig = exports.config = void 0;
const ENV_CONFIGS = {
    development: {
        env: 'development',
        apiBaseUrl: 'https://www.zhaotool.com',
        cdnBaseUrl: 'https://cdn.example.com/dev',
        reportUrl: 'https://report.example.com/dev',
        debug: true,
        enableMock: false,
    },
    staging: {
        env: 'staging',
        apiBaseUrl: 'https://www.zhaotool.com',
        cdnBaseUrl: 'https://cdn.example.com/staging',
        reportUrl: 'https://report.example.com/staging',
        debug: true,
        enableMock: false,
    },
    production: {
        env: 'production',
        apiBaseUrl: 'https://www.zhaotool.com',
        cdnBaseUrl: 'https://cdn.example.com/prod',
        reportUrl: 'https://report.example.com/prod',
        debug: false,
        enableMock: false,
    },
};
function detectEnv() {
    wx.getSystemInfoSync();
    try {
        const accountInfo = wx.getAccountInfoSync();
        if (accountInfo.miniProgram.envVersion === 'release') {
            return 'production';
        }
        if (accountInfo.miniProgram.envVersion === 'trial') {
            return 'staging';
        }
    }
    catch (_a) {
        // getAccountInfoSync may not be available in all environments
    }
    return 'development';
}
const currentEnv = detectEnv();
exports.currentEnv = currentEnv;
exports.config = ENV_CONFIGS[currentEnv];
function getConfig() {
    return exports.config;
}
exports.getConfig = getConfig;
//# sourceMappingURL=index.js.map