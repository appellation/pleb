const Validator = require('../../core/commands/Validator');

exports.triggers = [
  'stfu',
  'stop',
  'leave'
];

exports.exec = (cmd) => {
  const pl = cmd.client.bot.playlists;
  if (pl.has(cmd.guild.id)) pl.get(cmd.guild.id).destroy();
  if (cmd.guild.voiceConnection) cmd.guild.voiceConnection.disconnect();
  return cmd.response.send('k 😢');
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensureGuild();
};
