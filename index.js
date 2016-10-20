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

// Define commands
const commands = {
    add: require('./commands/add'),
    play: require('./commands/play'),
    stfu: require('./commands/stfu'),
    shuffle: require('./commands/shuffle'),
    pause: require('./commands/pause'),
    resume: require('./commands/resume'),
    next: require('./commands/next'),
    ping: require('./commands/ping'),
    imgur: require('./commands/imgur'),
    help: require('./commands/help'),
    boobs: require('./commands/boobs'),
    memes: require('./commands/memes'),
    stats: require('./commands/stats'),
    dick: require('./commands/dick'),
    id: require('./commands/id'),
    born: require('./commands/born'),
    search: require('./commands/search'),
    insult: require('./commands/insult'),
    catfacts: require('./commands/catfacts'),
    listen: require('./commands/listen')
};

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
        }).catch(console.error);
    }
});

client.on('message', function (message) {
    console.log("count#event.message=1");

    const cmd = require('./operators/command')(client, message);
    if(cmd) {
        cmd.call().then(cmd.respond);
    }
});

client.login(process.env.discord).then(function()   {
    console.log('Logged in.');
}).catch(function(err)   {
    console.error(err);
});