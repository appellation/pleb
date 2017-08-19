const Validator = require('../../core/commands/Validator');

exports.exec = async (cmd) => {
  const settings = cmd.client.bot.db.settings[cmd.message.guild.id];
  if (!settings) return cmd.response.error('your guild doesn\'t seem to exist... 👀');
  return cmd.response.success(`Current prefix is: \`${await settings.get('prefix')}\``);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensureGuild();
};
