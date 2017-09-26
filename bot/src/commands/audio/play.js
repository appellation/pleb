const { Argument, Validator, Command } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Validator(this).ensureCanPlay();
    await new Argument(this, 'song')
      .setResolver(c => c || null)
      .setPrompt('What song would you like to add?')
      .setInfinite();
  }

  async exec() {
    const list = this.guild.playlist;

    list.stop();
    list.reset();

    const added = await list.add(this.response, this.args.song);
    if (added) return list.start(this.response);
  }
};
