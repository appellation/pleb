const storage = require('../util/storage/settings');

module.exports = class {
    constructor({ bot }) {
        this.bot = bot;
    }

    exec(cmd) {
        return cmd.response.success(`Current prefix is: \`${storage.get(cmd.message.guild.id).getCached('prefix')}\``);
    }

    validate(val) {
        return val.ensureGuild();
    }
};
