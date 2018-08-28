const AudioCommand = require('../../core/commands/Audio');
const { Validator } = require('discord-handles');

module.exports = class extends AudioCommand {
  async pre() {
    await new Validator(this).ensureCurrentVoiceChannel();
  }

  exec() {
    return this.player.leave();
  }
};
