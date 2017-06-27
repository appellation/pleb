const path = require('path');
const handles = require('discord-handles');
const Raven = require('raven');

const Validator = require('./Validator');

module.exports = class extends (handles.Client) {
  constructor(bot) {
    const baseRegex = new RegExp(`<@!?${process.env.discord_client_id}>\\s*`);
    super({
      directory: path.join('.', 'src', 'commands'),
      validator: message => {
        if (message.channel.type === 'dm') return message.content.replace(baseRegex, '');

        const regex = bot.guildSettings.has(message.guild.id) ?
          bot.guildSettings.get(message.guild.id).getCached('prefix') :
          baseRegex;

        if (message.channel.name === 'pleb' || regex.test(message.content)) {
          return message.content.replace(regex, '');
        }
      },
      commandParams: { bot },
      Validator
    });

    this.bot = bot;

    this.on('commandStarted', command => {
      this.bot.log.debug('command started: %s', command.resolvedContent);
      this.bot.usage.add(command);
    });

    this.on('commandError', ({ command, error }) => {
      this.bot.log.error('command failed: %s', command.trigger, error);
      command.response.error(`\`${error}\`\nYou should never receive an error like this.  Bot owner has been notified.`);
    });

    this.once('commandsLoaded', () => {
      this.bot.log.info(`commands loaded in ${process.uptime()}s`);
    });

    this.on('error', (err) => {
      if (process.env.raven) Raven.captureException(err);
      else console.error(err); // eslint-disable-line no-console
    });
  }
};
