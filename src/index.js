/**
 * Created by Will on 8/25/2016.
 */
require('./util/extensions');
require('moment-duration-format');
require('dotenv').config({ silent: true });
const Discord = require('discord.js');
const Raven = require('raven');
const log = require('./util/log');

const client = new Discord.Client({
    messageCacheLifetime: 1800,
    messageSweepInterval: 900,
    disabledEvents: [
        'TYPING_START',
        'TYPING_STOP',
    ]
});

log.verbose('instantiated client');

if(process.env.raven) {
    Raven.config(process.env.raven, {
        captureUnhandledRejections: true
    }).install();

    Raven.wrap(load)();
    log.verbose('loaded functions with raven');
} else {
    load();
    log.verbose('loaded functions');
}

function load() {
    const initHandler = require('./handlers/init');
    const readyHandler = require('./handlers/ready');
    const guildCreateHandler = require('./handlers/guildCreate');
    const messageHandler = require('./handlers/message');
    const voiceStateUpdateHandler = require('./handlers/voiceStateUpdate');

    log.verbose('loaded event handlers');

    client.once('ready', () => initHandler(client));
    client.on('ready', readyHandler);
    client.on('guildCreate', guildCreateHandler);
    client.on('message', messageHandler);
    client.on('voiceStateUpdate', voiceStateUpdateHandler);

    log.verbose('instantiated event listeners');

    client.login(process.env.discord);
}
