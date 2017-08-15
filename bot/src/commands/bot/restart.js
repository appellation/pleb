const resolvers = require('../../util/resolvers');
const Validator = require('../../core/commands/Validator');
const { Argument } = require('discord-handles');

exports.exec = async (cmd) => {
  await cmd.response.success(`restarting ${cmd.args.shard === null ? 'all shards' : `shard **${cmd.args.shard}**`}`);
  if (cmd.args.shard === null) await cmd.client.bot.client.shard.broadcastEval('process.exit(0)');
  else await cmd.client.bot.client.shard.broadcastEval(`if (this.shard.id === ${cmd.args.shard}) process.exit(0)`);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensureIsOwner();
  yield new Argument('shard')
    .setRePrompt('Please provide a valid shard number to restart.')
    .setResolver(resolvers.integer)
    .setOptional();
};
