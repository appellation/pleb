const { Argument } = require('discord-handles');
const Validator = require('../../core/commands/Validator');

exports.exec = async (cmd) => {
  const bot = cmd.client.bot;
  await bot.db.r.table('playlists').insert({
    id: [cmd.args.name, cmd.message.author.id],
    name: cmd.args.name,
    userID: cmd.message.author.id,
    songs: Array.from(bot.cassette.playlists.get(cmd.guild.id))
  }, { conflict: 'update' });
  return cmd.response.success(`successfully saved current playlist to your library as \`${cmd.args.name}\``);
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensurePlaylist(cmd.client.bot.cassette);

  const name = yield new Argument('name')
    .setPrompt('What would you like to name this playlist?')
    .setRePrompt('You provided an invalid name.');
    
  const existing = yield () => cmd.client.bot.db.r.table('playlists').get([name, cmd.message.author.id]);

  if (existing) {
    yield new Argument('confirmation')
      .setPrompt('That playlist already exists.  Would you like to overwrite it?')
      .setRePrompt('Please say either `yes` or `no`.')
      .setResolver(c => c === 'yes' ? true : c === 'no' ? false : null);
  }
};
