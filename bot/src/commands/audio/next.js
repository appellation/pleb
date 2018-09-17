const AudioCommand = require('../../core/commands/Audio');
const { Argument, Validator } = require('discord-handles');

module.exports = class extends AudioCommand {
  static get triggers() {
    return ['next', 'skip'];
  }

  async pre() {
    await new Validator(this).ensurePlaylist();
    await new Argument(this, 'count')
      .setOptional()
      .setResolver(c => isNaN(c) ? null : parseInt(c));
  }

  exec() {
    return this.playlist.next(this.args.count || 1);
  }
};
