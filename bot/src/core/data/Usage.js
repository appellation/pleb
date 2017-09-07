module.exports = class Usage {
  constructor(provider) {
    this.provider = provider;
  }

  add(command) {
    return this.provider.r.table('usage').insert({
      name: command.trigger,
      userID: command.message.author.id,
      guildID: command.guild ? command.guild.id : null,
      timestamp: new Date(),
    });
  }
};
