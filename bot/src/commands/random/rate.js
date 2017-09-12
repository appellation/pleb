const random = require('../../util/random');
const { Argument, Command } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Argument(this, 'text')
      .setPrompt('What would you like to rate?')
      .setResolver(c => c || null);
  }

  exec() {
    const num = random.number(12);
    return this.response.success(`👌 **${num}/${num === 9 ? 11 : 10}**`);
  }
};
