const Validator = require('../../core/commands/Validator');
const { Argument } = require('discord-handles');

const allowedSettings = new Set([
  'prefix'
]);

exports.exec = async (cmd) => {
  const settings = cmd.client.bot.db.settings[cmd.guild.id];
  if (!settings) return cmd.response.error('your guild doesn\'t seem to exist... 👀');

  await settings.set(cmd.args.key, cmd.args.value);
  return cmd.response.success(`**${cmd.args.key}** set to \`${cmd.args.value}\``);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensureGuild();
  const settings = Array.from(allowedSettings.values()).join(', ');
  const key = yield new Argument('key')
    .setPrompt(`What setting would you like to modify? \`${settings}\``)
    .setRePrompt(`That setting wasn't valid.  Please try again.  \`${settings}\``)
    .setResolver(c => allowedSettings.has(c.toLowerCase()) ? c.toLowerCase() : null);

  yield new Argument('value')
    .setPrompt(`What would you like to set ${key} to?`)
    .setPattern(/.*/);
};
