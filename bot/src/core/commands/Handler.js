const path = require('path');
const util = require('util');
const handles = require('discord-handles');
const Raven = require('raven');

module.exports = class extends (handles.Client) {
  constructor(client) {
    const baseRegex = new RegExp(`<@!?${process.env.discord_client_id}>\\s*`);

    super(client, {
      directory: path.join('.', 'src', 'commands'),
      validator: async message => {
        if (message.channel.type === 'dm') return message.content.replace(baseRegex, '');
        if (message.member && message.member.roles.exists('name', 'no-pleb')) return;

        let prefix = null;
        const settings = message.guild.settings;
        if (settings) prefix = await settings.get('prefix');

        const prefixed = prefix && message.content.startsWith(prefix);
        if (message.channel.name === 'pleb' || baseRegex.test(message.content) || prefixed) {
          let m;
          if (prefixed) m = message.content.substr(prefix.length);
          else m = message.content.replace(baseRegex, '');
          return m.trim();
        }
      },
    });

    this.client = client;

    this.on('commandStarted', async command => {
      this.client.log.debug('command started: %s', command.resolvedContent);
      await this.client.db.models.usage.create({
        command: command.trigger.toString(),
        id: command.message.id,
        channelID: command.channel.id,
        userID: command.author.id,
      });
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
        // console.error(error); // eslint-disable-line no-console
      }

      try {
        this.client.log.error('command failed: %s', command.trigger, error);
        await command.response.error(`\`${error}\`\nYou should never receive an error like this.  Bot owner has been notified.`);
      } catch (e) {
        this.client.log.error(util.inspect(error));
        command.response.error('Error could not be displayed; needless to say, it borke.  Bot owner has been notified.');
      }
    });
  }
};
