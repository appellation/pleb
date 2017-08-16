const path = require('path');
const util = require('util');
const containerized = require('containerized');
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
      if (containerized()) this.bot.usage.add(command);
    });

    this.on('commandError', async ({ command, error }) => {

      if (process.env.raven) {
        const extra = {
          message: {
            content: command.message.content,
            id: command.message.id,
            type: command.message.type,
          },
          channel: {
            id: command.message.channel.id,
            type: command.message.channel.type,
          },
          guild: {},
          client: {
            shard: command.client.shard ? command.client.shard.id : null,
            ping: command.client.ping,
            status: command.client.status,
          },
        };

        if (command.message.channel.type === 'text') {
          extra.guild = {
            id: command.guild.id,
            name: command.guild.name,
            owner: command.guild.ownerID,
          };

          const perms = command.message.channel.permissionsFor(command.guild.me);
          extra.channel.permissions = perms ? perms.serialize() : null;
        }

        Raven.captureException(error, {
          user: {
            id: command.message.author.id,
            username: command.message.author.tag,
          },
          extra,
        });
      } else {
        console.error(error); // eslint-disable-line no-console
      }

      try {
        this.bot.log.error('command failed: %s', command.trigger, error);
        await command.response.error(`\`${error}\`\nYou should never receive an error like this.  Bot owner has been notified.`);
      } catch (e) {
        this.bot.log.error(util.inspect(error));
        command.response.error('Error could not be displayed; needless to say, it borke.  Bot owner has been notified.');
      }
    });
  }
};
