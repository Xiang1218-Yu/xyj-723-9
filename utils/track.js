"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRACK_STORAGE_KEY_PREFIX = void 0;
exports.trackStateStyle = trackStateStyle;
/** 本地缓存历史记录 key 前缀 */
exports.TRACK_STORAGE_KEY_PREFIX = 'TN::';
/** 根据轨迹状态返回展示样式 */
function trackStateStyle(status) {
    switch (status) {
        case 'Delivered':
            return { css: 'track-success', iconType: 'success' };
        case 'Expired':
        case 'DeliverFailed':
            return { css: 'track-error', iconType: 'warn' };
        case 'Transit':
        case 'PickUp':
            return { css: 'track-info', iconType: 'waiting' };
        default:
            return { css: 'track-null', iconType: 'clear' };
    }
}
//# sourceMappingURL=track.js.map