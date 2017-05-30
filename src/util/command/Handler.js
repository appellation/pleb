const path = require('path');
const handles = require('discord-handles');
const Raven = require('raven');

const Validator = require('./Validator');
module.exports = class extends (handles.Client) {
    constructor(bot) {
        super({
            directory: path.join('.', 'src', 'commands'),
            validator: message => {
                if (message.channel.type === 'dm') {
                    return message.content;
                } else {
                    const regex = bot.guildSettings.get(message.guild.id).getCached('prefix');
                    if (message.channel.name === 'pleb' || regex.test(message.content)) {
                        return message.content.replace(regex, '');
                    }
                }
            },
            commandParams: { bot },
            Validator
        });

        this.on('commandStarted', command => {
            bot.log.debug('command started: %s', command.resolvedContent);
        });

        this.on('commandFailed', ({ command, error }) => {
            bot.log.error('command failed: %s | %s', command, error);
            command.response.error(`\`${error}\`\nYou should never receive an error like this.  Bot owner has been notified.`);
        });

        this.on('error', (err) => {
            if (process.env.raven) Raven.captureException(err);
            else console.error(err); // eslint-disable-line no-console
        });
    }
};
