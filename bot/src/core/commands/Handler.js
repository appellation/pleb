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
        if (message.member && message.member.roles.exists('name', 'no-pleb')) return null;

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

        return null;
      },
    });

    this.client = client;

    this.handler.pre.push(async function() {
      Raven.setContext({
        user: {
          username: this.author.tag,
          id: this.author.id,
        },
        extra: {
          command: this.trigger.toString(),
          message: {
            content: this.message.content,
            createdAt: this.message.createdAt,
          },
          guild: {
            id: this.guild.id,
            name: this.guild.name,
          },
        },
      });

      this.client.log.verbose('command started: %s', this.trigger);

      await this.client.db.models.usage.create({
        command: this.trigger.toString(),
        id: this.message.id,
        channelID: this.channel.id,
        userID: this.author.id,
      });
    });

    this.on('commandError', async ({ command, error }) => {
      Raven.captureException(error);

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
