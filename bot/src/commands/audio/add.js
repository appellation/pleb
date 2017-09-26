const { Argument, Command, Validator } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Validator(this).ensureCanPlay();

    await new Argument(this, 'next')
      .setPattern(/next/i)
      .setOptional();

    await new Argument(this, 'song')
      .setPrompt('What would you like to add?')
      .setInfinite();
  }

  async exec() {
    const list = this.guild.playlist;
    const added = await list.add(this.response, this.args.song, {
      position: this.args.next ? list.pos + 1 : Infinity,
    });

    if (added && !list.playing) await list.start(this.response);
  }
};
