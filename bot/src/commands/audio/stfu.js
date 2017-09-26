const { Command, Validator } = require('discord-handles');

module.exports = class extends Command {
  static get triggers() {
    return ['stfu', 'stop', 'leave'];
  }

  async pre() {
    await new Validator(this).ensureGuild();
  }

  exec() {
    const pl = this.guild.playlist;
    if (pl) pl.destroy();
    if (this.guild.voiceConnection) this.guild.voiceConnection.disconnect();
    return this.response.send('k 😢');
  }
};

exports.triggers = [
  'stfu',
  'stop',
  'leave'
];
