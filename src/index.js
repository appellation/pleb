/**
 * Created by Will on 8/25/2016.
 */
require('./util/array');
require('dotenv').config({ silent: true });
const Discord = require('discord.js');
const Raven = require('raven');

const client = new Discord.Client({
    messageCacheLifetime: 1800,
    messageSweepInterval: 900,
    disabledEvents: [
        'TYPING_START',
        'TYPING_STOP',
    ]
});

if(process.env.raven)   {
    Raven.config(process.env.raven, {
        captureUnhandledRejections: true
    }).install();

    Raven.wrap(load)();
}   else {
    load();
}

process.on('unhandledRejection', console.error);

function load() {
    const readyHandler = require('./handlers/ready');
    const guildCreateHandler = require('./handlers/guildCreate');
    const guildMemberSpeakingHandler = require('./handlers/guildMemberSpeaking');
    const messageHandler = require('./handlers/message');
    const voiceStateUpdateHandler = require('./handlers/voiceStateUpdate');

    client.on('ready', readyHandler);
    client.on('guildCreate', guildCreateHandler);
    client.on('guildMemberSpeaking', guildMemberSpeakingHandler);
    client.on('message', messageHandler);
    client.on('voiceStateUpdate', voiceStateUpdateHandler);

    client.login(process.env.discord);
}
