const resolvers = require('../../util/resolvers');
const { Argument, Command } = require('discord-handles');

module.exports = class extends Command {
  static get triggers() {
    return ['sanitize', 'purge', 'clean'];
  }

  async pre() {
    await new Argument(this, 'count')
      .setRePrompt('Please provide a valid number of messages to sanitize.')
      .setOptional()
      .setResolver(resolvers.integer);
  }

  async exec() {
    const collection = await this.channel.fetchMessages();
    const messages = collection.array().filter(m => m.author.id === this.client.user.id).slice(0, this.args.count || 3);
    if (messages.length < 1) return this.response.error('Unable to find any messages to purge.');
    if (messages.length === 1) {
      await messages[0].delete();
      return this.response.success('Purged last message.', this.author);
    }
    if (!this.channel.permissionsFor(this.client.user).has('MANAGE_MESSAGES')) return this.response.error('I need `Manage Messages` permissions to sanitize.');
    const deleted = await this.channel.bulkDelete(messages);
    return this.response.success(`Purged last ${deleted.size} messages.`, this.author);
  }
};
