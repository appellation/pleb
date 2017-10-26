const resolvers = require('../../util/resolvers');
const { Argument, Command, Validator } = require('discord-handles');

module.exports = class extends Command {
  static get triggers() {
    return ['sanitize', 'purge', 'clean'];
  }

  async pre() {
    await new Validator(this).ensureClientPermissions('MANAGE_MESSAGES');

    await new Argument(this, 'count')
      .setRePrompt('Please provide a valid number of messages to sanitize.')
      .setOptional()
      .setResolver(resolvers.integer);
  }

  async exec() {
    const collection = await this.channel.fetchMessages();
    const messages = collection.first(Math.min(this.args.count || 3, 100));
    if (messages.length < 1) return this.response.error('Unable to find any messages to purge.');
    if (messages.length === 1) {
      await messages[0].delete();
      return this.response.success('Purged last message.', this.author);
    }
    const deleted = await this.channel.bulkDelete(messages);
    return this.response.success(`Purged last ${deleted.size} messages.`);
  }
};
