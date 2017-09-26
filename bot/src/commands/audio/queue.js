const { Argument, Command, Validator } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Validator(this).ensurePlaylist();
    await new Argument(this, 'page')
      .setOptional()
      .setResolver(c => !c || isNaN(c) ? null : parseInt(c));
  }

  exec() {
    const list = this.guild.playlist,
      perPage = 5,
      pos = this.args.page ? ((this.args.page - 1) * perPage) : list.pos,
      part = list.slice(pos, pos + perPage);

    return this.response.send(part.reduce((prev, song, index) => {
      return `${prev}**${index + pos + 1}** of ${list.length} - \`${song.title}\`\n`;
    }, this.args.page ? `Page **${Math.floor(pos/perPage) + 1}** of **${Math.ceil(list.length/perPage)}**\n` : '➡ '));
  }
};
