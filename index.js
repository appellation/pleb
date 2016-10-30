/**
 * Created by Will on 8/25/2016.
 */
require('dotenv').config({
    silent: true
});
const Discord = require('discord.js');

if(process.env.raven)   {
    const raven = require('raven');
    var ravenClient = new raven.Client(process.env.raven);
    ravenClient.patchGlobal();
}

var client = new Discord.Client();

client.on('ready', function()   {
    console.log('Bot is ready.');
});

client.on('guildCreate', function(guild) {
    console.log("count#event.guildCreate=1");
    guild.defaultChannel.sendMessage('Sup.  Try `@Pleb help`.');
});

client.on('guildMemberSpeaking', function(member, speaking) {
    if(member.listen && speaking)   {

        const msg = member.listen;
        member.listen = false;

        member.voiceChannel.join().then(conn => {
            return require('./operators/voiceConnection').speechToText(conn.createReceiver().createPCMStream(member))
        }).then(text => {
            if(msg.constructor.name == 'Message')    {
                msg.channel.sendMessage('`' + text + '`');
            }

            const cmd = require('./operators/command')(client, msg, text.toLowerCase());
            if(cmd) {
                cmd.call();
            }
        }).catch(console.error);
    }
});

client.on('message', function (message) {
    console.log("count#event.message=1");

    const cmd = require('./operators/command')(client, message);
    if(cmd) {
        cmd.call();
    }
});

client.login(process.env.discord).then(function()   {
    console.log('Logged in.');
}).catch(function(err)   {
    console.error(err);
});