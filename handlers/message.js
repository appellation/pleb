/**
 * Created by Will on 12/6/2016.
 */

const rp = require('request-promise-native');
const command = require('discord-handles')({
    respond: true,
    directory: __dirname + '/../commands',
    validator: message => {
        const regex = new RegExp(`^<@!?${process.env.discord_client_id}> *`);
        if((message.channel.name === 'pleb' || regex.test(message.content) || message.channel.type === 'dm') && ((message.member && !message.member.roles.find('name', 'no-pleb')) || message.channel.type === 'dm')) {
            return message.content.replace(regex, '');
        }
    }
});

if(process.env.ifttt)   {
    command().on('commandStarted', obj => {
        const guild = obj.message.guild;
        rp.post('https://maker.ifttt.com/trigger/pleb/with/key/' + process.env.ifttt, {
            body: {
                value1: obj.content,
                value2: obj.message.author.id,
                value3: guild ? guild.id : 'dm'
            },
            json: true
        }).catch(() => null);
    });
}

function message(message, body)   {
    command(message, body).catch(() => null);
}

module.exports = message;