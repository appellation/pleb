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
    if (this.args.query) await this.playlist.add(this.args.query);

    const tracks = await this.playlist.tracks();
    await this.playlist.stop();
    await this.playlist.add(...tracks); // no need to use the extended add method
    return this.start();
  }
};
