import SupervisorLog from './log';
import {clearInterval} from "timers";

export default class ErrorCapture {
    public constructor() {
        process.on('uncaughtException', (error) => {
            require('fs').writeFileSync(global.OriginalRoot + "/lastCrash.txt", new Date() + "\n" + require('os').userInfo().username + "@" + require('os').hostname() + "\n\n" + error.stack);
            SupervisorLog.bugCheck("main", "An error occurred: " + error.name + "; additional details in " + global.OriginalRoot + "/lastCrash.txt");
            clearInterval(global.ProcessChecks);
            global.FinishRuntime();
            clearInterval(global.Tick);
            process.exit(255);
        })
    }

}