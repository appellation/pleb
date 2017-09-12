const { Argument, Command, Validator } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Validator(this).ensurePlaylist(this.client.bot.cassette);

    const name = await new Argument(this, 'name')
      .setPrompt('What would you like to name this playlist?')
      .setRePrompt('You provided an invalid name.');

    const existing = await this.client.bot.db.r.table('playlists').get([name, this.message.author.id, this.guild.id]).run();

    if (existing) {
      await new Argument(this, 'confirmation')
        .setPrompt('That playlist already exists.  Would you like to overwrite it?')
        .setRePrompt('Please say either `yes` or `no`.')
        .setResolver(c => c === 'yes' ? true : c === 'no' ? false : null);
    }
  }

  exec() {
    return this.client.bot.db.r.table('playlists').insert({
      id: [this.args.name, this.message.author.id, this.guild.id],
      name: this.args.name,
      userID: this.message.author.id,
      guildID: this.guild.id,
      songs: Array.from(this.guild.playlist)
    }, { conflict: 'update' });
  }

  post() {
    return this.response.success(`successfully saved current playlist to your library as \`${this.args.name}\``);
  }
};
