"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressStorage = exports.storage = void 0;
const index_1 = require("../constants/index");
const common_1 = require("./common");
/**
 * 同步存储封装
 */
exports.storage = {
    set(key, data) {
        try {
            wx.setStorageSync(key, data);
        }
        catch (err) {
            console.error('[storage.set] failed:', key, err);
        }
    },
    get(key, fallback = null) {
        try {
            const data = wx.getStorageSync(key);
            return (data !== '' ? data : fallback);
        }
        catch (err) {
            console.error('[storage.get] failed:', key, err);
            return fallback;
        }
    },
    remove(key) {
        try {
            wx.removeStorageSync(key);
        }
        catch (err) {
            console.error('[storage.remove] failed:', key, err);
        }
    },
    clear() {
        try {
            wx.clearStorageSync();
        }
        catch (err) {
            console.error('[storage.clear] failed:', err);
        }
    },
};
/**
 * 快递历史记录管理
 */
exports.expressStorage = {
    KEY_PREFIX: index_1.STORAGE_KEYS.EXPRESS_HISTORY_PREFIX,
    getAll() {
        const result = [];
        try {
            const info = wx.getStorageInfoSync();
            info.keys.forEach((key) => {
                if (key.startsWith(exports.expressStorage.KEY_PREFIX)) {
                    const data = (0, common_1.safeJsonParse)(wx.getStorageSync(key), {
                        number: '',
                        time: '',
                    });
                    if (data.number)
                        result.push(data);
                }
            });
        }
        catch (err) {
            console.error('[expressStorage.getAll] failed:', err);
        }
        return result.sort((a, b) => b.time.localeCompare(a.time));
    },
    save(number) {
        const key = `${exports.expressStorage.KEY_PREFIX}${number}`;
        exports.storage.set(key, JSON.stringify({ number, time: new Date().toISOString() }));
    },
    remove(number) {
        exports.storage.remove(`${exports.expressStorage.KEY_PREFIX}${number}`);
    },
};
//# sourceMappingURL=storage.js.map