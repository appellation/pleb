const { Argument, Command, Validator } = require('discord-handles');

module.exports = class extends Command {
  static get triggers() {
    return ['next', 'skip'];
  }

  async pre() {
    await new Validator(this).ensurePlaylist();
    await new Argument(this, 'count')
      .setOptional()
      .setResolver(c => isNaN(c) ? null : parseInt(c));
  }

  async exec() {
    const list = this.guild.playlist;
    let next = true;
    for (let i = 0; i < (this.args.count || 1) && next; i++) next = await list.next();
    return list.start(this.response);
  }
};
