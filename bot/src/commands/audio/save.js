const { Argument } = require('discord-handles');

exports.exec = async (cmd) => {
  const bot = cmd.client.bot;
  await bot.r.table('playlists').insert({ name: cmd.args.name, songs: bot.cassette.playlists.get(cmd.guild.id).slice() });
  return cmd.response.success(`successfully saved current playlist as ${cmd.args.name}`);
};

exports.middleware = function* () {
  yield new Argument('name')
    .setPrompt('What would you like to name this playlist?')
    .setRePrompt('You provided an invalid name.');
};
