const AudioCommand = require('../../core/commands/Audio');
const { Validator } = require('discord-handles');

module.exports = class LoopCommand extends AudioCommand {
  async pre() {
    await new Validator(this).ensurePlaylist();
  }

  exec() {
    if (this.playlist.isLooping) {
      this.playlist.loop = null;
      this.response.success('stopped looping');
    } else {
      this.playlist.loop = 0;
      this.response.success('now looping');
    }
  }
};
