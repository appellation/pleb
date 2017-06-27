const Validator = require('../../core/Validator');
const { Argument } = require('discord-handles');

exports.exec = (cmd) => {
  const list = cmd.client.bot.playlists.get(cmd.message.guild.id);
  for (let i = 0; i < (cmd.args.count || 1) && list.hasPrev(); i++) list.prev();
  return list.start(cmd.response);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensurePlaylist(cmd.client.bot);
  yield new Argument('count')
    .setOptional()
    .setRePrompt('Please provide a number of songs to skip.')
    .setResolver(c => !c || isNaN(c) ? null : parseInt(c));
};
