const commandFunctions = require('../util/command/util');
const Validator = require('../util/command/ValidationProcessor');
const handles = require('discord-handles');
const Raven = require('raven');
const path = require('path');

const command = new handles.Client({
    directory: path.join('.', 'src', 'commands'),
    validator: message => {
        const regex = commandFunctions.fetchPrefix(message.guild);
        if((message.channel.name === 'pleb' || message.channel.type === 'dm' || regex.test(message.content)) && ((message.member && !message.member.roles.find('name', 'no-pleb')) || message.channel.type === 'dm')) {
            return message.content.replace(regex, '');
        }
    },
    Validator
});

command.on('commandStarted', command => {
    command.message.client.log.debug('command started: %s', command.resolvedContent);
});

command.on('invalidCommand', validator => {
    validator.command.response.error(validator.reason);
});

command.on('commandFailed', ({ command, error }) => {
    command.message.client.log.error('command failed: %s | %s', command, error);
    command.response.error(`\`${error}\`\nYou should never receive an error like this.  Bot owner has been notified.`);
});

command.on('error', (err) => {
    if(process.env.raven) Raven.captureException(err);
    else console.error(err); // eslint-disable-line no-console
});

function message(message, body) {
    message.client.log.silly('message received: %s#%s | %s', message.author.username, message.author.discriminator, message.cleanContent);
    command.handle(message, body);
}

module.exports = message;
