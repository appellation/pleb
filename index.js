/**
 * Created by Will on 8/25/2016.
 */
require('dotenv').config({
    silent: true
});
const Discord = require('discord.js');
var client = new Discord.Client();

const readyHandler = require('./handlers/ready');
const guildCreateHandler = require('./handlers/guildCreate');
const guildMemberSpeakingHandler = require('./handlers/guildMemberSpeaking');
const messageHandler = require('./handlers/message');

client.on('ready', readyHandler);
client.on('guildCreate', guildCreateHandler);
client.on('guildMemberSpeaking', guildMemberSpeakingHandler);
client.on('message', messageHandler);

client.login(process.env.discord).then(function()   {
    console.log('Logged in.');
}).catch(function(err)   {
    console.error(err);
});