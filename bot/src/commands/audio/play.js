const Playlist = require('../../core/audio/Playlist');
const { Argument } = require('discord-handles');
const Validator = require('../../core/commands/Validator');

exports.exec = async (cmd) => {
  const list = Playlist.get(cmd.client.bot, cmd.message.guild);

  list.stop();
  list.reset();

  try {
    await list.add(cmd.response, cmd.args.song);
  } catch (e) {
    await cmd.response.error(e.message || e);
    return;
  }

  return list.start(cmd.response);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensureCanPlay();
  yield new Argument('song')
    .setPrompt('What song would you like to add?')
    .setPattern(/.*/);
};
