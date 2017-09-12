const { Command, Validator } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Validator(this).ensurePlaylist();
  }

  exec() {
    return this.guild.playlist.resume();
  }
};
