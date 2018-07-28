const AudioCommand = require('../../core/commands/Audio');
const { Validator } = require('discord-handles');

module.exports = class extends AudioCommand {
  static get triggers() {
    return ['stfu', 'stop', 'leave'];
  }

  async pre() {
    await new Validator(this).ensureGuild();
  }

  async exec() {
    await this.playlist.stop();
    await this.player.leave();
    return this.response.send('k 😢');
  }
};

exports.triggers = [
  'stfu',
  'stop',
];
