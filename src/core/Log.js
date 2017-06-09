const winston = require('winston');
const request = require('request-promise-native');
const { RichEmbed } = require('discord.js');

module.exports = class extends winston.Logger {
    constructor(client) {
        super({
            transports: [
                new (winston.transports.File)({ filename: 'pleb.log' }),
                new (winston.transports.Console)(),
            ],
            level: 'verbose'
        });

        this.client = client;
    }

    hook(data = {}) {
        const embed = new RichEmbed(data)
            .setFooter(`Shard ${this.client.shard.id}`)
            .setTimestamp();
        return this._webhook({
            body: {
                embeds: [embed]
            }
        });
    }

    _webhook(data) {
        if (!process.env.webhook_url) return Promise.resolve();
        return request(Object.assign(data, {
            uri: process.env.webhook_url,
            json: true,
            method: 'post'
        }));
    }
};
