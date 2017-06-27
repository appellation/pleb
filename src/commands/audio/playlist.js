const Playlist = require('../../core/audio/Playlist');
const Validator = require('../../core/Validator');
const { Argument } = require('discord-handles');

exports.exec = async (cmd) => {
  const list = Playlist.get(cmd.client.bot, cmd.message.guild);

  list.stop();
  list.reset();

  try {
    await list.add(cmd.response, cmd.args.list, undefined, 'playlist');
  } catch (e) {
    await cmd.response.error(e.message || e);
    return;
  }

  return list.start(cmd.response);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensureCanPlay();
  yield new Argument('list')
    .setPrompt('What playlist would you like to search for?')
    .setPattern(/.*/);
};
