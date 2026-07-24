"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeJsonParse = exports.generateId = exports.deepClone = exports.throttle = exports.debounce = exports.getDateStr = exports.formatTime = void 0;
/**
 * 时间格式化工具
 */
function formatTime(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hour = d.getHours();
    const minute = d.getMinutes();
    const second = d.getSeconds();
    return ([year, month, day].map(formatNumber).join('-') +
        ' ' +
        [hour, minute, second].map(formatNumber).join(':'));
}
exports.formatTime = formatTime;
/**
 * 获取当前日期字符串 YYYY-MM-DD
 */
function getDateStr(date) {
    const d = date || new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
exports.getDateStr = getDateStr;
function formatNumber(n) {
    const s = n.toString();
    return s[1] ? s : '0' + s;
}
/**
 * 防抖函数
 */
function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        if (timer)
            clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}
exports.debounce = debounce;
/**
 * 节流函数
 */
function throttle(fn, interval) {
    let lastTime = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastTime >= interval) {
            lastTime = now;
            fn.apply(this, args);
        }
    };
}
exports.throttle = throttle;
/**
 * 深拷贝
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object')
        return obj;
    if (obj instanceof Date)
        return new Date(obj.getTime());
    if (obj instanceof Array)
        return obj.map((item) => deepClone(item));
    const cloned = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}
exports.deepClone = deepClone;
/**
 * 生成唯一ID
 */
function generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
exports.generateId = generateId;
/**
 * 安全的 JSON 解析
 */
function safeJsonParse(str, fallback) {
    try {
        return JSON.parse(str);
    }
    catch (_a) {
        return fallback;
    }
}
exports.safeJsonParse = safeJsonParse;
//# sourceMappingURL=common.js.map