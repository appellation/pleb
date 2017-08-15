const DiscordPlaylist = require('../../core/audio/Playlist');
const { Argument } = require('discord-handles');
const Validator = require('../../core/commands/Validator');

exports.exec = async (cmd) => {
  const list = DiscordPlaylist.get(cmd.client.bot.cassette, cmd.message.guild);

  list.stop();
  list.reset();

  const added = await list.add(cmd.response, cmd.args.song);
  if (added) return list.start(cmd.response);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensureCanPlay();
  yield new Argument('song')
    .setPrompt('What song would you like to add?')
    .setInfinite();
};
