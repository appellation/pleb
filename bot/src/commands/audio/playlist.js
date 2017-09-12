const { Argument, Command, Validator } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Validator(this).ensureCanPlay();
    await new Argument(this, 'list')
      .setResolver(c => c || null)
      .setPrompt('What playlist would you like to search for?')
      .setInfinite();
  }

  async exec() {
    const list = this.guild.playlist;

    list.stop();
    list.reset();

    const added = await list.add(this.response, this.args.list, {
      searchType: 'playlist',
    });

    if (added) return list.start(this.response);
  }
};
