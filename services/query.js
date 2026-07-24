"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQueryResult = exports.getQueryType = exports.queryInfo = void 0;
const request_1 = require("./request");
const index_1 = require("../constants/index");
/**
 * 执行归属地查询
 * @param q 查询内容（银行卡号/手机号/身份证号）
 */
function queryInfo(q) {
    return request_1.http.post(index_1.API_PATHS.QUERY_INFO, { q });
}
exports.queryInfo = queryInfo;
/**
 * 根据 SID 判断查询类型
 */
function getQueryType(sid) {
    const map = {
        S100: 'bank',
        S101: 'phone',
        S102: 'idcard',
    };
    return map[sid];
}
exports.getQueryType = getQueryType;
/**
 * 解析查询结果，统一格式
 */
function parseQueryResult(response) {
    return {
        type: getQueryType(response.sid),
        data: response.data,
    };
}
exports.parseQueryResult = parseQueryResult;
//# sourceMappingURL=query.js.map