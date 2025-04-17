"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const log_1 = __importDefault(require("./log"));
const webhookClient = new discord_js_1.WebhookClient({ id: global.config.Webhook.Id, token: global.config.Webhook.Token });
class Webhookhandler {
    static report(message, restarted, restartCount, panic) {
        if (panic) {
            webhookClient.send({
                username: 'Izzy Moonbot Supervisor',
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setColor('#dd7a08')
                        .setTitle('Izzy Moonbot got forcefully stopped.')
                        .setDescription("Izzy Moonbot has been forcefully stopped with the `.panic` command.\nYou can find logs in `" + global.LogFileName + "`")
                        .setTimestamp()
                ]
            }).then(() => {
                log_1.default.info("webhk", "Sent panic report.");
            });
        }
        else {
            webhookClient.send({
                username: 'Izzy Moonbot Supervisor',
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setColor('#dd0808')
                        .setTitle('Izzy Moonbot crashed.')
                        .setDescription("Izzy Moonbot crashed (" + message + "), " + (restarted ? "it has restarted automatically (restart count: " + restartCount + ")" : "it has not restarted automatically (stopped after " + global.config.MaxRestarts + " failed attempts)") + ".\nYou can find additional details about the error in `" + global.LogFileName + "`")
                        .setTimestamp()
                ]
            }).then(() => {
                log_1.default.info("webhk", "Sent crash report.");
            });
        }
    }
    static cleared(file) {
        webhookClient.send({
            username: 'Izzy Moonbot Supervisor',
            embeds: [
                new discord_js_1.MessageEmbed()
                    .setColor('#dd7a08')
                    .setTitle('One of Izzy Moonbot\'s files is empty.')
                    .setDescription("File `" + file + "` is unexpectedly empty and has been restored from a backup, Izzy is starting normally now.")
                    .setTimestamp()
            ]
        }).then(() => {
            log_1.default.info("webhk", "Sent cleared file report.");
        });
    }
}
exports.default = Webhookhandler;
//# sourceMappingURL=webhook.js.map