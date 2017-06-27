const { Argument } = require('discord-handles');
const Validator = require('../../core/Validator');

exports.triggers = ['next', 'skip'];

exports.exec = (cmd) => {
  const list = cmd.client.bot.playlists.get(cmd.message.guild.id);
  for (let i = 0; i < (cmd.args.count || 1) && list.hasNext(); i++) list.next();
  return list.start(cmd.response);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensurePlaylist(cmd.client.bot);
  yield new Argument('count')
    .setOptional()
    .setResolver(c => isNaN(c) ? null : parseInt(c));
};
