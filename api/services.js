"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBanner = fetchBanner;
exports.lookupInfo = lookupInfo;
exports.fetchRate = fetchRate;
exports.fetchExpress = fetchExpress;
/**
 * 业务 API 集合：将各页面分散的 wx.request 收敛为按领域组织的接口方法
 * @module api/services
 */
const request_1 = require("./request");
/** 首页轮播图 */
function fetchBanner() {
    return (0, request_1.get)('/v1/h/images');
}
/**
 * 归属地综合查询（银行卡/手机号/身份证）
 * 后端通过 sid 区分命中类型，这里返回完整响应体以便页面判断
 */
function lookupInfo(q) {
    return (0, request_1.post)('/v1/wx/info', { q });
}
/** 查询汇率 */
function fetchRate(from, to, date) {
    return (0, request_1.get)(`/v1/wx/huobi/${from}/${to}/${date}`);
}
/** 国际包裹轨迹查询 */
function fetchExpress(trackingNumber) {
    return (0, request_1.post)(`/v1/exp/info/${trackingNumber}`);
}
//# sourceMappingURL=services.js.map