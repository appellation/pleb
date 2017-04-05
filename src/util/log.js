const winston = require('winston');
const request = require('request-promise-native');
const { RichEmbed } = require('discord.js');

module.exports = class extends winston.Logger {
    constructor(client) {
        super({
            transports: [
                new (winston.transports.Console)(),
                new (winston.transports.File)({ filename: 'pleb.log' })
            ],
            level: 'verbose'
        });

        this.client = client;

        this.webhook = request.defaults({
            uri: process.env.webhook_url,
            json: true,
            method: 'post'
        });
    }

    hook(data = {}) {
        const embed = new RichEmbed(data)
            .setTimestamp();
        return this.webhook({
            body: {
                embeds: [embed]
            }
        });
    }
};
