/*require('dotenv').config({
    silent: true
});
const Discord = require('discord.js');
var client = new Discord.Client({
    messageCacheLifetime: 1800,
    messageSweepInterval: 900,
    disabledEvents: [
        'CHANNEL_CREATE',
        'CHANNEL_UPDATE',
        'CHANNEL_DELETE',
        'CHANNEL_PINS_UPDATE',
        'DEBUG',
        'DISCONNECT',
        'ERROR',
        'GUILD_UPDATE',
        'GUILD_DELETE',
        'GUILD_BAN_ADD',
        'GUILD_BAN_REMOVE',
        'GUILD_EMOJI_CREATE',
        'GUILD_EMOJI_DELETE',
        'GUILD_EMOJI_UPDATE',
        'GUILD_MEMBER_ADD',
        'GUILD_MEMBER_AVAILABLE',
        'GUILD_MEMBER_REMOVE',
        'GUILD_MEMBERS_CHUNK',
        'ROLE_CREATE',
        'ROLE_UPDATE',
        'ROLE_DELETE',
        'GUILD_UNAVAILABLE',
        'MESSAGE_UPDATE',
        'MESSAGE_DELETE',
        'MESSAGE_DELETE_BULK',
        'PRESENCE_UPDATE',
        'TYPING_START',
        'TYPING_STOP',
        'USER_SETTINGS_UPDATE',
        'RECONNECTING',
        'USER_UPDATE',
        'WARN'
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

client.login(process.env.discord).then(function()   {
    console.log('Logged in.');
}).catch(function(err)   {
    console.error(err);
});*/
