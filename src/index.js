/**
 * Created by Will on 8/25/2016.
 */
require('./util/extensions');
require('moment-duration-format');
require('dotenv').config({ silent: true });
const Discord = require('discord.js');
const Raven = require('raven');
const Log = require('./util/log');

new class extends Discord.Client {
    constructor() {
        super({
            messageCacheLifetime: 1800,
            messageSweepInterval: 900,
            disabledEvents: [
                'TYPING_START',
                'TYPING_STOP',
            ]
        });

        this.log = new Log(this);

        this.log.verbose('instantiated client');

        if(process.env.raven) {
            Raven.config(process.env.raven, {
                captureUnhandledRejections: true
            }).install();

            Raven.wrap(this._load)();
            this.log.verbose('loaded functions with raven');
        } else {
            this._load();
            this.log.verbose('loaded functions');
        }
    }

    _load() {
        const initHandler = require('./handlers/init');
        const readyHandler = require('./handlers/ready');
        const disconnectHandler = require('./handlers/disconnect');
        const guildCreateHandler = require('./handlers/guildCreate');
        const messageHandler = require('./handlers/message');
        const voiceStateUpdateHandler = require('./handlers/voiceStateUpdate');

        this.log.verbose('loaded event handlers');

        this.once('ready', () => initHandler(this));
        this.on('ready', readyHandler);
        this.on('disconnect', close => disconnectHandler(this, close));
        this.on('guildCreate', guildCreateHandler);
        this.on('message', messageHandler);
        this.on('voiceStateUpdate', voiceStateUpdateHandler);
        this.on('error', Raven.captureException);

        this.log.verbose('instantiated event listeners');

        this.login(process.env.discord);
    }
};
