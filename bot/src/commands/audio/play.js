const AudioCommand = require('../../core/commands/Audio');
const { Argument, Validator } = require('discord-handles');

module.exports = class extends AudioCommand {
  async pre() {
    await new Validator(this).ensureCanPlay();
    await new Argument(this, 'song')
      .setResolver(c => c || null)
      .setPrompt('What song would you like to add?')
      .setInfinite();
  }

  async exec() {
    await this.guild.playlist.clear();
    await this.add(this.args.song);
    return this.start();
  }
};
