const { Argument } = require('discord-handles');
const Validator = require('../../core/commands/Validator');

exports.exec = (cmd) => {
  const list = cmd.client.bot.cassette.playlists.get(cmd.message.guild.id),
    perPage = 5,
    pos = cmd.args.page ? ((cmd.args.page - 1) * perPage) : (list.pos - 1),
    part = list.songs.slice(pos, pos + perPage);

  return cmd.response.send(part.reduce((prev, song, index) => {
    return `${prev}**${index + pos + 1}** of ${list.length} - \`${song.title}\`\n`;
  }, cmd.args.page ? `Page **${Math.floor(pos/perPage) + 1}** of **${Math.ceil(list.length/perPage)}**\n` : '⭐ '));
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensurePlaylist(cmd.client.bot);
  yield new Argument('page')
    .setOptional()
    .setResolver(c => !c || isNaN(c) ? null : parseInt(c));
};
