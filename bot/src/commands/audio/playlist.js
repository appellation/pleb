const AudioCommand = require('../../core/commands/Audio');
const { Argument, Validator } = require('discord-handles');

module.exports = class extends AudioCommand {
  async pre() {
    await new Validator(this).ensureCanPlay();
    await new Argument(this, 'list')
      .setResolver(c => c || null)
      .setPrompt('What playlist would you like to search for?')
      .setInfinite();
  }

  async exec() {
    await this.playlist.stop();
    await this.playlist.add(this.args.list, true);
    return this.playlist.start(this.response);
  }
};
