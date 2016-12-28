/**
 * Created by Will on 8/25/2016.
 */
require('dotenv').config({ silent: true });

if(process.env.raven)   {
    var Raven = require('raven');
    Raven.config(process.env.raven).install();
}

const Discord = require('discord.js');
const client = new Discord.Client({
    messageCacheLifetime: 1800,
    messageSweepInterval: 900,
    disabledEvents: [
        'TYPING_START',
        'TYPING_STOP',
    ]
});

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

client.login(process.env.discord).then(() => console.log('Logged in.')).catch(console.error);
