const AudioCommand = require('../../core/commands/Audio');
const { Validator } = require('discord-handles');

module.exports = class extends AudioCommand {
  async pre() {
    await new Validator(this).ensureGuild();
  }

  async exec() {
    await this.playlist.stop();
    await this.playlist.clear();
    await this.player.leave();
    await this.player.destroy();
    return this.response.send('k 😢');
  }
};

exports.triggers = [
  'stfu',
  'stop',
];
