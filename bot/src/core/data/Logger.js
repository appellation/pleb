const winston = require('winston');
const request = require('axios');
const { RichEmbed } = require('discord.js');

module.exports = class Logger extends winston.Logger {
  constructor(client) {
    super({
      transports: [
        new (winston.transports.File)({ filename: 'pleb.log' }),
        new (winston.transports.Console)(),
      ],
      level: process.env.log_level || 'verbose'
    });

    this.client = client;
  }

  hook(data = {}) {
    const embed = new RichEmbed(data)
      .setFooter(`Shard ${this.client.shard.id}`)
      .setTimestamp();

    return this._send({
      embeds: [embed]
    });
  }

  _send(data) {
    if (!process.env.webhook_url) return Promise.resolve();
    return request.post(process.env.webhook_url, data);
  }
};
