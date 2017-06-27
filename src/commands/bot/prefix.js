const Validator = require('../../core/Validator');

exports.exec = (cmd) => {
  return cmd.response.success(`Current prefix is: \`${cmd.client.bot.guildSettings.get(cmd.message.guild.id).getCached('prefix')}\``);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensureGuild();
};
