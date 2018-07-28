const AudioCommand = require('../../core/commands/Audio');
const { Argument, Validator } = require('discord-handles');

module.exports = class extends AudioCommand {
  async pre() {
    await new Validator(this).ensurePlaylist();
    await new Argument(this, 'page')
      .setOptional()
      .setResolver(c => !c || isNaN(c) ? null : parseInt(c));
  }

  async exec() {
    const tracks = await this.playlist.tracks();
    var list = await this.client.lavaqueue.decode(tracks),
      perPage = 5,
      pos = this.args.page ? ((this.args.page - 1) * perPage) : 0,
      part = list.slice(pos, pos + perPage);

    return this.response.send(part.reduce((prev, song, index) => {
      return `${prev}**${index + pos + 1}** of ${list.length} - \`${song.info.title}\` (<${song.info.uri}>)\n`;
    }, this.args.page ? `Page **${Math.floor(pos/perPage) + 1}** of **${Math.ceil(list.length/perPage)}**\n` : '➡ '));
  }
};
