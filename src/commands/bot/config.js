const allowedSettings = new Set([
  'prefix'
]);

module.exports = class {
  constructor({ bot }) {
    this.bot = bot;
  }

  async exec(cmd) {
    let settings = this.bot.guildSettings.get(cmd.guild.id);
    if (!settings) settings = await this.bot.provider.initializeGuild(cmd.guild);
    await settings.set(cmd.args.key, cmd.args.value);
    return cmd.response.success(`**${cmd.args.key}** set to \`${cmd.args.value}\``);
  }

  * arguments(Argument) {
    const settings = Array.from(allowedSettings.values()).join(', ');
    const key = yield new Argument('key')
      .setPrompt(`What setting would you like to modify? \`${settings}\``)
      .setRePrompt(`That setting wasn't valid.  Please try again.  \`${settings}\``)
      .setResolver(c => allowedSettings.has(c.toLowerCase()) ? c.toLowerCase() : null);

    yield new Argument('value')
      .setPrompt(`What would you like to set ${key} to?`)
      .setPattern(/.*/);
  }

  validate(val) {
    return val.ensureGuild();
  }
};
