const { Argument, Command, Validator } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Validator(this).ensureCanPlay();
    await new Argument(this, 'query')
      .setOptional()
      .setInfinite();
  }

  async exec() {
    const list = this.guild.playlist;

    if (this.args.query) await list.add(this.response, this.args.query);

    list.stop();
    list.shuffle();
    return list.start(this.response);
  }
};
