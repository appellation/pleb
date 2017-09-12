const { Argument, Command, Validator } = require('discord-handles');

const allowedSettings = new Set([
  'prefix'
]);

module.exports = class extends Command {
  async pre() {
    await new Validator(this).ensureGuild();

    const settings = Array.from(allowedSettings.values()).join(', ');
    const key = await new Argument(this, 'key')
      .setPrompt(`What setting would you like to modify? \`${settings}\``)
      .setRePrompt(`That setting wasn't valid.  Please try again.  \`${settings}\``)
      .setResolver(c => allowedSettings.has(c.toLowerCase()) ? c.toLowerCase() : null);

    await new Argument(this, 'value')
      .setPrompt(`What would you like to set ${key} to?`)
      .setInfinite();
  }

  async exec() {
    const settings = this.client.bot.db.settings[this.guild.id];
    if (!settings) return this.response.error('your guild doesn\'t seem to exist... 👀');

    await settings.set(this.args.key, this.args.value);
    return this.response.success(`**${this.args.key}** set to \`${this.args.value}\``);
  }
};
