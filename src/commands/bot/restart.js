const resolvers = require('../../util/command/resolvers');

module.exports = class {
    constructor({ bot }) {
        this.bot = bot;
    }

    async exec(cmd) {
        await cmd.response.success(`restarting ${cmd.args.shard === null ? 'all shards' : `shard **${cmd.args.shard}**`}`);
        if (cmd.args.shard === null) await this.bot.client.shard.broadcastEval('process.exit(0)');
        else await this.bot.client.shard.broadcastEval(`if (this.shard.id === ${cmd.args.shard}) process.exit(0)`);
    }

    * arguments(Argument) {
        yield new Argument('shard')
            .setRePrompt('Please provide a valid shard number to restart.')
            .setResolver(resolvers.integer)
            .setOptional();
    }

    validate(val) {
        return val.ensureIsOwner();
    }
};
