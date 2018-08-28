const { Argument, Validator } = require('discord-handles');
const AudioCommand = require('../../core/commands/Audio');

module.exports = class extends AudioCommand {
  async pre() {
    await new Validator(this).ensureCanPlay();
    await new Argument(this, 'song')
      .setPrompt('What would you like to add?')
      .setInfinite();
  }

  async exec() {
    const [added, title] = await this.add(this.args.song);
    if (added && !this.player.playing) await this.start(title);
  }
};
