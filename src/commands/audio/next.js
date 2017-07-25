const { Argument } = require('discord-handles');
const Validator = require('../../core/commands/Validator');

exports.triggers = ['next', 'skip'];

exports.exec = (cmd) => {
  const list = cmd.client.bot.cassette.playlists.get(cmd.message.guild.id);
  let next = true;
  for (let i = 0; i < (cmd.args.count || 1) && next; i++) next = list.next();
  return list.start(cmd.message.member);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensurePlaylist(cmd.client.bot.cassette);
  yield new Argument('count')
    .setOptional()
    .setResolver(c => isNaN(c) ? null : parseInt(c));
};
