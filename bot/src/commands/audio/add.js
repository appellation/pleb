const { Argument } = require('discord-handles');
const Validator = require('../../core/commands/Validator');
const Playlist = require('../../core/audio/Playlist');

exports.exec = async (cmd) => {
  const list = Playlist.get(cmd.client.bot, cmd.message.guild);

  try {
    await list.add(cmd.response, cmd.args.song, cmd.args.next ? list.pos : undefined);
  } catch (e) {
    await cmd.response.error(e.message || e);
    return;
  }

  if (!list.playing) list.start(cmd.response);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensureCanPlay();
  yield new Argument('next')
    .setPattern(/next/i)
    .setOptional();

  yield new Argument('song')
    .setPrompt('What would you like to add?')
    .setPattern(/.*/);
};
