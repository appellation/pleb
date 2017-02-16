/**
 * Created by Will on 12/6/2016.
 */

const commandFunctions = require('../util/command');
const rp = require('request-promise-native');
const ValidationProcessor = require('../util/command/ValidationProcessor');
const Handles = require('discord-handles');
const Raven = require('raven');

const command = new Handles({
    directory: __dirname + '/../commands',
    validator: message => {
        const regex = commandFunctions.fetchPrefix(message.guild);
        if((message.channel.name === 'pleb' || message.channel.type === 'dm' || regex.test(message.content)) && ((message.member && !message.member.roles.find('name', 'no-pleb')) || message.channel.type === 'dm')) {
            return message.content.replace(regex, '');
        }
    },
    ValidationProcessor
});

if(process.env.ifttt)   {
    command.on('commandStarted', command => {
        const guild = command.message.guild;
        rp.post('https://maker.ifttt.com/trigger/pleb/with/key/' + process.env.ifttt, {
            body: {
                value1: command.resolvedContent,
                value2: command.message.author.id,
                value3: guild ? guild.id : 'dm'
            },
            json: true
        });
    });
}

command.on('commandFailed', ({ command, err }) => {
    command.response.error(`\`${err}\`\nYou should never receive an error like this.  Bot owner has been notified.`)
});

command.on('error', (err) => {
    if(process.env.raven) Raven.captureException(err);
    else console.error(err);
});

function message(message, body)   {
    command.handle(message, body);
}

module.exports = message;