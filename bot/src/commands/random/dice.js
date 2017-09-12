const { roll } = require('../../util/random');
const resolvers = require('../../util/resolvers');
const { Argument, Command } = require('discord-handles');

module.exports = class extends Command {
  static get triggers() {
    return ['dice', 'roll'];
  }

  async pre() {
    await new Argument(this, 'count')
      .setPrompt('How many dice would you like to roll?')
      .setRePrompt('Please roll between 1 and 999 dice.')
      .setResolver(c => {
        const parsed = parseInt(c);
        if (isNaN(parsed)) return null;
        return parsed > 0 && parsed < 1000 ? parsed : null;
      });

    await new Argument(this, 'sides')
      .setPrompt('How many sides should these dice have?')
      .setRePrompt('Please choose a number of sides.')
      .setResolver(resolvers.integer);
  }

  exec() {
    if (this.args.count >= 1000) return this.response.error('Please use less than 1,000 dice.  kthxbye.');
    const sum = roll(this.args.count, this.args.sides);
    return this.response.success(`**${sum}** 🎲`);
  }
};
