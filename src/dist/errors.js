"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __importDefault(require("./log"));
const timers_1 = require("timers");
class ErrorCapture {
    constructor() {
        process.on('uncaughtException', (error) => {
            require('fs').writeFileSync(global.OriginalRoot + "/lastCrash.txt", new Date() + "\n" + require('os').userInfo().username + "@" + require('os').hostname() + "\n\n" + error.stack);
            log_1.default.bugCheck("main", "An error occurred: " + error.name + "; additional details in " + global.OriginalRoot + "/lastCrash.txt");
            (0, timers_1.clearInterval)(global.ProcessChecks);
            global.FinishRuntime();
            (0, timers_1.clearInterval)(global.Tick);
            process.exit(255);
        });
    }
}
exports.default = ErrorCapture;
//# sourceMappingURL=errors.js.map