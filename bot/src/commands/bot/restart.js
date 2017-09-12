const resolvers = require('../../util/resolvers');
const { Argument, Command, Validator } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Validator(this).ensureIsOwner();
    await new Argument(this, 'shard')
      .setRePrompt('Please provide a valid shard number to restart.')
      .setResolver(resolvers.integer)
      .setOptional();
  }

  async exec() {
    await this.response.success(`restarting ${this.args.shard === null ? 'all shards' : `shard **${this.args.shard}**`}`);
    if (this.args.shard === null) await this.client.shard.broadcastEval('process.exit(0)');
    else await this.client.shard.broadcastEval(`if (this.shard.id === ${this.args.shard}) process.exit(0)`);
  }
};
