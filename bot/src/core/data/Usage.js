const Table = require('./base');

module.exports = class Usage extends Table {
  constructor(provider) {
    super(provider, 'usage');
    this.provider = provider;
  }

  add(command) {
    return this.insert({
      name: command.trigger,
      userID: command.message.author.id,
      guildID: command.guild ? command.guild.id : null,
      timestamp: new Date(),
    });
  }
};
