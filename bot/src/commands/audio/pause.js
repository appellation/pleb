const AudioCommand = require('../../core/commands/Audio');
const { Validator } = require('discord-handles');

module.exports = class extends AudioCommand {
  async pre() {
    await new Validator(this).ensurePlaylist();
  }

  exec() {
    return this.guild.playlist.player.pause();
  }
};
