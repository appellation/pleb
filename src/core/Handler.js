const path = require('path');
const util = require('util');
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
        if (message.member && message.member.roles.exists('name', 'no-pleb')) return;

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

    this.on('commandError', async ({ command, error }) => {
      if (process.env.raven) Raven.captureException(error);
      else console.error(error); // eslint-disable-line no-console

      try {
        this.bot.log.error('command failed: %s', command.trigger, error);
        await command.response.error(`\`${error}\`\nYou should never receive an error like this.  Bot owner has been notified.`);
      } catch (e) {
        this.bot.log.error(util.inspect(error));
        command.response.error('Error could not be displayed; needless to say, it borke.  Bot owner has been notified.');
      }
    });

    this.once('commandsLoaded', () => {
      this.bot.log.info(`commands loaded in ${process.uptime()}s`);
    });
  }
};
