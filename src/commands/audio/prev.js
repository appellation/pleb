const Validator = require('../../core/commands/Validator');
const { Argument } = require('discord-handles');

exports.exec = (cmd) => {
  const list = cmd.client.bot.cassette.playlists.get(cmd.message.guild.id);
  let prev = true;
  for (let i = 0; i < (cmd.args.count || 1) && prev; i++) prev = list.prev();
  return list.start(cmd.message.member);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensurePlaylist(cmd.client.bot);
  yield new Argument('count')
    .setOptional()
    .setRePrompt('Please provide a number of songs to skip.')
    .setResolver(c => !c || isNaN(c) ? null : parseInt(c));
};
