const Validator = require('../../core/commands/Validator');

exports.triggers = [
  'stfu',
  'stop',
  'leave'
];

exports.exec = (cmd) => {
  const pl = cmd.client.bot.cassette.playlists.get(cmd.guild.id);
  if (pl) pl.destroy();
  if (cmd.guild.voiceConnection) cmd.guild.voiceConnection.disconnect();
  return cmd.response.send('k 😢');
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensureGuild();
};
