"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __importDefault(require("./log"));
class CompilerInfo {
    constructor() {
        function timeDifference(current, previous) {
            let msPerMinute = 60 * 1000;
            let msPerHour = msPerMinute * 60;
            let msPerDay = msPerHour * 24;
            let msPerMonth = msPerDay * 30;
            let msPerYear = msPerDay * 365;
            let elapsed = current - previous;
            if (elapsed < msPerMinute) {
                return Math.round(elapsed / 1000) + ' seconds ago';
            }
            else if (elapsed < msPerHour) {
                return Math.round(elapsed / msPerMinute) + ' minutes ago';
            }
            else if (elapsed < msPerDay) {
                return Math.round(elapsed / msPerHour) + ' hours ago';
            }
            else if (elapsed < msPerMonth) {
                return Math.round(elapsed / msPerDay) + ' days ago';
            }
            else if (elapsed < msPerYear) {
                return Math.round(elapsed / msPerMonth) + ' months ago';
            }
            else {
                return Math.round(elapsed / msPerYear) + ' years ago';
            }
        }
        if (global._IzzyMoonbotSupervisorBuildInfo) {
            log_1.default.info("main", "Compiler information:");
            log_1.default.info("main", "    " + global._IzzyMoonbotSupervisorBuildInfo.user);
            log_1.default.info("main", "    " + global._IzzyMoonbotSupervisorBuildInfo.path);
            log_1.default.info("main", "    " + global._IzzyMoonbotSupervisorBuildInfo.date);
            log_1.default.info("main", "        " + timeDifference(new Date().getTime(), global._IzzyMoonbotSupervisorBuildInfo.time));
            log_1.default.info("main", "    for NodeJS " + global._IzzyMoonbotSupervisorBuildInfo.target);
            log_1.default.info("main", "        running on " + process.versions.node);
            log_1.default.info("main", "    compressed with zlib " + global._IzzyMoonbotSupervisorBuildInfo.zlib);
            log_1.default.info("main", "        running on " + process.versions.zlib);
        }
        else {
            log_1.default.info("main", "<no compiler information found>");
        }
    }
}
exports.default = CompilerInfo;
//# sourceMappingURL=compiler.js.map