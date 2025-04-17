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
global.RuntimeRoot = __dirname;
let config;
global.config = config = {
    Backup: {
        Frequency: 120,
        Files: [
            "/home/ubuntu/izzy-moonbot/botsettings/scheduled-tasks.conf",
            "/home/ubuntu/izzy-moonbot/botsettings/config.conf",
            "/home/ubuntu/izzy-moonbot/botsettings/users.conf"
        ],
        Keep: 50
    },
    MaxRestarts: 3,
    ChecksFrequency: 5,
    MaxMemory: -1,
    Webhook: {
        Id: "995436232203059443",
        Token: "fCoDa81oBubcoygIKJlQs2a2psvyW2Qpz6dxS6zRx0XhjYJA_DT9fgK_yj9ZXFlFNiYu"
    }
};
const log_1 = __importDefault(require("./log"));
const errors_1 = __importDefault(require("./errors"));
const compiler_1 = __importDefault(require("./compiler"));
const webhook_1 = __importDefault(require("./webhook"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const fsp = __importStar(require("fs/promises"));
const crypto = __importStar(require("crypto"));
const cp = __importStar(require("child_process"));
const pidusage = require('pidusage');
const timers_1 = require("timers");
if (!fs.existsSync(global.OriginalRoot + "/logs"))
    fs.mkdirSync(global.OriginalRoot + "/logs");
if (!fs.existsSync(global.OriginalRoot + "/backups"))
    fs.mkdirSync(global.OriginalRoot + "/backups");
global.LogFileName = global.OriginalRoot + "/logs/" + new Date().toISOString() + ".txt";
fs.writeFileSync(global.LogFileName, "");
global.Tick = setInterval(() => { });
new errors_1.default();
// @ts-ignore
process.stdout.clearLine();
process.stdout.cursorTo(0);
log_1.default.info("main", "Welcome to the Izzy Moonbot supervisor!");
new compiler_1.default();
log_1.default.warn("main", "This program was made by a small hard-working weak alicorn. If you like it, don't forget to support her! (really... it's hard, I always go unnoticed .c.)");
if (process.argv.length !== 3) {
    if (process.argv.length < 3) {
        log_1.default.error("main", "Unable to start Izzy Moonbot: no executable path specified");
        process.exit(255);
    }
    else if (process.argv.length > 3) {
        log_1.default.error("main", "Unable to start Izzy Moonbot: too many arguments");
        process.exit(255);
    }
}
global.FullPath = path.resolve(process.argv[2]);
if (!fs.existsSync(global.FullPath)) {
    log_1.default.error("main", "Unable to start Izzy Moonbot: " + global.FullPath + ": no such file or directory");
    process.exit(255);
}
if (!fs.lstatSync(global.FullPath).isFile()) {
    log_1.default.error("main", "Unable to start Izzy Moonbot: " + global.FullPath + ": not a file");
    process.exit(255);
}
try {
    fs.accessSync(global.FullPath, fs.constants.X_OK);
}
catch (e) {
    log_1.default.error("main", "Unable to start Izzy Moonbot: " + global.FullPath + ": permission denied");
    process.exit(255);
}
let signature = crypto.createHash("sha256").update(fs.readFileSync(global.FullPath)).digest("hex");
let size = (fs.readFileSync(global.FullPath).length / 1024).toFixed(2);
async function backup() {
    log_1.default.info("backp", "Starting backup");
    let backupID = (await fsp.readdir(global.OriginalRoot + "/backups")).length;
    await fsp.mkdir(global.OriginalRoot + "/backups/" + backupID);
    log_1.default.info("backp", "Using slot " + backupID);
    for (let file of config.Backup.Files) {
        let ogfile = file;
        file = path.resolve(file);
        if (fs.existsSync(file)) {
            if ((await fsp.readFile(file)).toString().trim() !== "") {
                log_1.default.info("backp", "Backing up " + file + " to backup slot " + backupID);
                let fileID = require('crypto').createHash("sha256").update(ogfile).digest("hex");
                await fsp.copyFile(file, global.OriginalRoot + "/backups/" + backupID + "/" + fileID);
            }
            else {
                log_1.default.warn("backp", "Attempted to backup " + file + " but it is empty");
            }
        }
        else {
            log_1.default.warn("backp", "Attempted to backup " + file + " but it doesn't exist");
        }
    }
    log_1.default.info("backp", "Removing old backups");
    while ((await fsp.readdir(global.OriginalRoot + "/backups")).length > global.config.Backup.Keep + 1) {
        for (let file of (await fsp.readdir(global.OriginalRoot + "/backups/0")).sort((a, b) => parseInt(a) - parseInt(b))) {
            await fsp.unlink(global.OriginalRoot + "/backups/0/" + file);
        }
        await fsp.rmdir(global.OriginalRoot + "/backups/0");
        for (let dir of (await fsp.readdir(global.OriginalRoot + "/backups")).sort((a, b) => parseInt(a) - parseInt(b))) {
            await fsp.rename(global.OriginalRoot + "/backups/" + dir, global.OriginalRoot + "/backups/" + (parseInt(dir) - 1) + ".new");
        }
        for (let dir of (await fsp.readdir(global.OriginalRoot + "/backups")).sort((a, b) => parseInt(a) - parseInt(b))) {
            await fsp.rename(global.OriginalRoot + "/backups/" + dir, global.OriginalRoot + "/backups/" + dir.replace(".new", ""));
        }
    }
}
log_1.default.info("main", "Scheduled backups every " + config.Backup.Frequency + " seconds");
setInterval(backup, config.Backup.Frequency * 1000);
let restartCount = 0;
function start() {
    log_1.default.info("main", "Checking backed up files...");
    for (let file of config.Backup.Files) {
        let ogfile = file;
        file = path.resolve(file);
        let fileID = require('crypto').createHash("sha256").update(ogfile).digest("hex");
        if (fs.existsSync(file)) {
            log_1.default.info("backp", "Checking file " + file);
            if (fs.readFileSync(file).toString().trim() === "") {
                log_1.default.warn("backp", "File is empty, restoring from backup");
                webhook_1.default.cleared(file);
                for (let dir of (fs.readdirSync(global.OriginalRoot + "/backups")).sort((a, b) => parseInt(a) - parseInt(b)).reverse()) {
                    for (let sel of (fs.readdirSync(global.OriginalRoot + "/backups/" + dir)).sort((a, b) => parseInt(a) - parseInt(b))) {
                        if (sel === fileID) {
                            log_1.default.info("backp", "Restoring " + file + " from backup slot " + dir);
                            fs.copyFileSync(global.OriginalRoot + "/backups/" + dir + "/" + sel, file);
                            break;
                        }
                    }
                }
            }
            else {
                log_1.default.info("backp", "File " + file + " is OK");
            }
        }
        else {
            log_1.default.warn("backp", "Attempted to check " + file + " but it doesn't exist");
        }
    }
    global.ProcessAttemptedToTerminate = false;
    log_1.default.info("main", "Executable signature is " + signature + ", size is " + size + " kiB");
    log_1.default.info("main", "Starting " + global.FullPath);
    let proc = cp.spawn(global.FullPath, [], { stdio: "pipe" });
    log_1.default.info("main", "Child process is PID " + proc.pid + ", updating information every " + config.ChecksFrequency + " seconds");
    global.ProcessChecks = setInterval(async () => {
        let stats = await pidusage(proc.pid);
        log_1.default.heartbeat(stats.ppid + "/" + stats.pid + ", cpu: " + stats.cpu.toFixed(2) + "%, mem: " + (stats.memory / 1024).toFixed(2) + "K, running for " + Math.round(stats.elapsed / 1000) + " seconds");
        if (config.MaxMemory > -1 && stats.memory / 1024 >= config.MaxMemory) {
            if (global.ProcessAttemptedToTerminate) {
                log_1.default.warn("main", "Child process using too much memory, not terminated in time, killing it.");
                proc.kill("SIGKILL");
            }
            else {
                log_1.default.warn("main", "Child process using too much memory, attempting to terminate it.");
                proc.kill("SIGTERM");
                global.ProcessAttemptedToTerminate = true;
            }
        }
    }, 1000 * config.ChecksFrequency);
    proc.stdout.on('data', (data) => {
        let parts = data.toString().trim().split("\n");
        for (let part of parts) {
            log_1.default.info("child", part, true);
        }
    });
    proc.stderr.on('data', (data) => {
        let parts = data.toString().trim().split("\n");
        for (let part of parts) {
            log_1.default.warn("child", part, true);
        }
    });
    proc.on('exit', (code, signal) => {
        if (code === 0) {
            log_1.default.info("main", "Process exited with code 0");
            (0, timers_1.clearInterval)(global.ProcessChecks);
            global.FinishRuntime();
            (0, timers_1.clearInterval)(global.Tick);
            process.exit();
        }
        else if (code === 255) {
            webhook_1.default.report("Process exited because an administrator called .panic", false, 0, true);
            log_1.default.error("main", "Stopped with .panic, failing.");
            (0, timers_1.clearInterval)(global.ProcessChecks);
            global.FinishRuntime();
            (0, timers_1.clearInterval)(global.Tick);
        }
        else {
            log_1.default.error("main", "Process exited " + (code ? "with code " + code : "without an exit code") + (signal ? " (" + signal + ")" : ""));
            if (restartCount >= config.MaxRestarts) {
                webhook_1.default.report("Process exited " + (code ? "with code " + code : "without an exit code") + (signal ? " (" + signal + ")" : ""), false, restartCount);
                log_1.default.error("main", "Restart count is " + restartCount + ", failing.");
                (0, timers_1.clearInterval)(global.ProcessChecks);
                global.FinishRuntime();
                (0, timers_1.clearInterval)(global.Tick);
            }
            else {
                restartCount++;
                webhook_1.default.report("Process exited " + (code ? "with code " + code : "without an exit code") + (signal ? " (" + signal + ")" : ""), true, restartCount);
                log_1.default.info("main", "Restarting process, restart count is now " + restartCount);
                (0, timers_1.clearInterval)(global.ProcessChecks);
                start();
            }
        }
    });
}
start();
//# sourceMappingURL=core.js.map