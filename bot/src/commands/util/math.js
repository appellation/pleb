const math = require('mathjs');
const numeral = require('numeral');
const { Argument, Command } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Argument(this, 'expression')
      .setResolver(c => c || null)
      .setPrompt('What mathematical expression would you like to evaluate?')
      .setInfinite();
  }

  exec() {
    let out;
    try {
      out = math.eval(this.args.expression);
    } catch (e) {
      return this.response.error(`Error: \`${e.message}\``);
    }

    return this.response.success(`**${this.args.expression}** = \`${numeral(out).format('0,0.[0000000000]')}\``);
  }
};
