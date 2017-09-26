const { Argument, Command, Validator } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Validator(this).ensurePlaylist();
    await new Argument(this, 'count')
      .setOptional()
      .setRePrompt('Please provide a number of songs to skip.')
      .setResolver(c => !c || isNaN(c) ? null : parseInt(c));
  }

  exec() {
    const list = this.guild.playlist;
    let prev = true;
    for (let i = 0; i < (this.args.count || 1) && prev; i++) prev = list.prev();
    return list.start(this.response);
  }
};
