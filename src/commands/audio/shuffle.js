const DiscordPlaylist = require('../../core/audio/Playlist');
const { Argument } = require('discord-handles');
const Validator = require('../../core/commands/Validator');

exports.exec = async (cmd) => {
  const list = DiscordPlaylist.get(cmd.client.bot.cassette, cmd.message.guild);

  if (cmd.args.query) await list.add(cmd.response, cmd.args.query);

  list.stop();
  list.shuffle();
  return list.start(cmd.response);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensureCanPlay(cmd.client.bot);
  yield new Argument('query')
    .setOptional()
    .setInfinite();
};
