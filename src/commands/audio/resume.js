const Validator = require('../../core/commands/Validator');

exports.exec = (cmd) => {
  return cmd.client.bot.cassette.playlists.get(cmd.message.guild.id).resume();
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensurePlaylist(cmd.client.bot.cassette);
};
