module.exports = class Usage {
  constructor(bot) {
    this.bot = bot;
  }

  get model() {
    return this.bot.provider.models.Usage;
  }

  add(command) {
    return this.model.create({
      name: command.trigger,
      userID: command.message.author.id,
      guildID: command.guild ? command.guild.id : null
    });
  }
};
