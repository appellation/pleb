const Validator = require('../../core/Validator');

exports.exec = (cmd) => {
  const loop = cmd.client.bot.playlists.get(cmd.message.guild.id).toggleLoop();
  return cmd.response.success(`${loop ? 'Started' : 'Stopped'} looping current song.`);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensurePlaylist(cmd.client.bot);
};
