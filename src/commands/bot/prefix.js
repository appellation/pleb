module.exports = class {
  constructor({ bot }) {
    this.bot = bot;
  }

  exec(cmd) {
    return cmd.response.success(`Current prefix is: \`${this.bot.guildSettings.get(cmd.message.guild.id).getCached('prefix')}\``);
  }

  validate(val) {
    return val.ensureGuild();
  }
};
