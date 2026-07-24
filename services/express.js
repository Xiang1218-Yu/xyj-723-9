"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrackStatusStyle = exports.removeExpressHistory = exports.getExpressHistory = exports.fetchExpressInfo = void 0;
const request_1 = require("./request");
const index_1 = require("../constants/index");
const storage_1 = require("../utils/storage");
/**
 * 查询快递物流信息
 * @param number 快递单号
 */
function fetchExpressInfo(number) {
    return request_1.http
        .get(`${index_1.API_PATHS.EXPRESS_INFO}/${number}`, {
        showError: false,
    })
        .then((data) => {
        if (data) {
            storage_1.expressStorage.save(number);
        }
        return data;
    });
}
exports.fetchExpressInfo = fetchExpressInfo;
/**
 * 获取快递历史记录
 */
function getExpressHistory() {
    return storage_1.expressStorage.getAll();
}
exports.getExpressHistory = getExpressHistory;
/**
 * 删除快递历史记录
 */
function removeExpressHistory(number) {
    storage_1.expressStorage.remove(number);
}
exports.removeExpressHistory = removeExpressHistory;
/**
 * 根据状态获取样式
 */
function getTrackStatusStyle(status) {
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
exports.getTrackStatusStyle = getTrackStatusStyle;
//# sourceMappingURL=express.js.map