const { Command, Validator } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Validator(this).ensureGuild();
  }

  async exec() {
    const settings = this.client.bot.db.settings[this.guild.id];
    if (!settings) return this.response.error('your guild doesn\'t seem to exist... 👀');
    return this.response.success(`Current prefix is: \`${await settings.get('prefix')}\``);
  }
};
