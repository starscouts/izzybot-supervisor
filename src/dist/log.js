"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs"));
class SupervisorLog {
    static info(proc, message, resetColor = false) {
        process.stdout.clearLine(null);
        fs.appendFileSync(global.LogFileName, "\n[" + new Date().toISOString() + "] [INFO] (" + proc + "): " + (proc.length === 4 ? " " : "") + message);
        console.info(chalk_1.default.blue("[INFO] (" + proc + "): " + (proc.length === 4 ? " " : "") + (resetColor ? chalk_1.default.reset(message) : message)));
    }
    static heartbeat(message) {
        process.stdout.clearLine(null);
        process.stdout.write("    " + message);
        process.stdout.cursorTo(0);
    }
    static warn(proc, message, resetColor = false) {
        process.stdout.clearLine(null);
        fs.appendFileSync(global.LogFileName, "\n[" + new Date().toISOString() + "] [WARN] (" + proc + "): " + (proc.length === 4 ? " " : "") + message);
        console.warn(chalk_1.default.yellow("[WARN] (" + proc + "): " + (proc.length === 4 ? " " : "") + (resetColor ? chalk_1.default.reset(message) : message)));
    }
    static error(proc, message, resetColor = false) {
        process.stdout.clearLine(null);
        fs.appendFileSync(global.LogFileName, "\n[" + new Date().toISOString() + "] [CRIT] (" + proc + "): " + (proc.length === 4 ? " " : "") + message);
        console.error(chalk_1.default.red("[CRIT] (" + proc + "): " + (proc.length === 4 ? " " : "") + (resetColor ? chalk_1.default.reset(message) : message)));
    }
    static bugCheck(proc, message, resetColor = false) {
        process.stdout.clearLine(null);
        fs.appendFileSync(global.LogFileName, "\n[" + new Date().toISOString() + "] [BUGC] (" + proc + "): " + (proc.length === 4 ? " " : "") + message);
        console.error(chalk_1.default.magenta("[BUGC] (" + proc + "): " + (proc.length === 4 ? " " : "") + (resetColor ? chalk_1.default.reset(message) : message)));
    }
}
exports.default = SupervisorLog;
//# sourceMappingURL=log.js.map