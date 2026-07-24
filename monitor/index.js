"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapPage = exports.destroyMonitor = exports.initMonitor = exports.perfMonitor = exports.errorMonitor = exports.reporter = void 0;
var reporter_1 = require("./reporter");
Object.defineProperty(exports, "reporter", { enumerable: true, get: function () { return reporter_1.reporter; } });
var error_1 = require("./error");
Object.defineProperty(exports, "errorMonitor", { enumerable: true, get: function () { return error_1.errorMonitor; } });
var performance_1 = require("./performance");
Object.defineProperty(exports, "perfMonitor", { enumerable: true, get: function () { return performance_1.perfMonitor; } });
const reporter_2 = require("./reporter");
const error_2 = require("./error");
const performance_2 = require("./performance");
const request_1 = require("../services/request");
function initMonitor() {
    error_2.errorMonitor.init();
    performance_2.perfMonitor.init();
    reporter_2.reporter.start();
    (0, request_1.setPerformanceTracker)(performance_2.perfMonitor);
    (0, request_1.setErrorReporter)({
        report: (err) => {
            error_2.errorMonitor.captureError(err, { page: err.url });
        },
    });
}
exports.initMonitor = initMonitor;
function destroyMonitor() {
    reporter_2.reporter.stop();
    performance_2.perfMonitor.flush();
}
exports.destroyMonitor = destroyMonitor;
function wrapPage(options) {
    const withPerf = performance_2.perfMonitor.wrapPage(options);
    const withError = error_2.errorMonitor.wrapPage(withPerf);
    return withError;
}
exports.wrapPage = wrapPage;
//# sourceMappingURL=index.js.map