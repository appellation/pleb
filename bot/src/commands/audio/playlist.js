const DiscordPlaylist = require('../../core/audio/Playlist');
const Validator = require('../../core/commands/Validator');
const { Argument } = require('discord-handles');

exports.exec = async (cmd) => {
  const list = DiscordPlaylist.get(cmd.client.bot.cassette, cmd.guild);

  list.stop();
  list.reset();

  const added = await list.add(cmd.response, cmd.args.list, {
    searchType: 'playlist',
  });

  if (added) return list.start(cmd.response);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensureCanPlay();
  yield new Argument('list')
    .setPrompt('What playlist would you like to search for?')
    .setPattern(/.*/);
};
