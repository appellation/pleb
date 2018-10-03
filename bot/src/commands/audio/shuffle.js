const AudioCommand = require('../../core/commands/Audio');
const { Argument, Validator } = require('discord-handles');

module.exports = class extends AudioCommand {
  async pre() {
    await new Validator(this).ensureCanPlay();
    await new Argument(this, 'query')
      .setOptional()
      .setInfinite();
  }

  async exec() {
    if (this.args.query) await this.add(this.args.query);
    const list = await this.playlist.shuffle();
    if (list.length < 1) return this.response.error('nothing to shuffle');
    return this.response.success(`shuffled the next ${list.length} song${list.length === 1 ? '' : 's'}`);
  }
};
