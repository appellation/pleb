const { Validator } = require('../../core/Validator');

exports.exec = (cmd) => {
  return cmd.client.bot.playlists.get(cmd.message.guild.id).pause();
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensurePlaylist(cmd.client.bot);
};
