const Validator = require('../../core/commands/Validator');

exports.exec = (cmd) => {
  const loop = cmd.client.bot.cassette.playlists.get(cmd.message.guild.id).current.toggleLoop();
  return cmd.response.success(`${loop ? 'Started' : 'Stopped'} looping current song.`);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensurePlaylist(cmd.client.bot.cassette);
};
