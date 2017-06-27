const Playlist = require('../../core/audio/Playlist');
const { Argument } = require('discord-handles');
const Validator = require('../../core/Validator');

exports.exec = async (cmd) => {
  const list = Playlist.get(cmd.client.bot, cmd.message.guild);

  if (cmd.args.query) {
    try {
      await list.add(cmd.response, cmd.args.query);
    } catch (e) {
      await cmd.response.error(e.message || e);
      return;
    }
  }

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
