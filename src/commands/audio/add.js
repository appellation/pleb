const { Argument } = require('discord-handles');
const Validator = require('../../core/commands/Validator');
const DiscordPlaylist = require('../../core/audio/Playlist');

exports.exec = async (cmd) => {
  const list = DiscordPlaylist.get(cmd.client.bot.cassette, cmd.message.guild);

  const added = await list.add(cmd.response, cmd.args.song, {
    position: cmd.args.next ? list.pos : Infinity,
  });

  if (added && !list.playing) await list.start(cmd.response);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensureCanPlay();
  yield new Argument('next')
    .setPattern(/next/i)
    .setOptional();

  yield new Argument('song')
    .setPrompt('What would you like to add?')
    .setInfinite();
};
