const math = require('mathjs');
const numeral = require('numeral');
const { Argument } = require('discord-handles');

exports.exec = (cmd) => {
  let out;
  try {
    out = math.eval(cmd.args.expression);
  } catch (e) {
    return cmd.response.error(`Error: \`${e.message}\``);
  }

  return cmd.response.success(`**${cmd.args.expression}** = \`${numeral(out).format('0,0.[0000000000]')}\``);
};

exports.middleware = function* () {
  yield new Argument('expression')
    .setPrompt('What mathematical expression would you like to evaluate?')
    .setInfinite();
};
