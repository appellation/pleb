const storage = require('../util/storage/settings');

exports.func = (cmd) => {
    return cmd.response.success(`Current prefix is: \`${storage.get(cmd.message.guild.id).getCached('prefix')}\``);
};

exports.validator = val => val.ensureGuild();
