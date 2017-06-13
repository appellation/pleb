const { roll } = require('../../util/random');
const resolvers = require('../../util/resolvers');

exports.exec = (cmd) => {
  if (cmd.args.count >= 1000) return cmd.response.error('Please use less than 1,000 dice.  kthxbye.');
  const sum = roll(cmd.args.count, cmd.args.sides);
  return cmd.response.success(`**${sum}** 🎲`);
};

exports.arguments = function* (Argument) {
  yield new Argument('count')
    .setPrompt('How many dice would you like to roll?')
    .setRePrompt('Please roll between 1 and 999 dice.')
    .setResolver(c => {
      const parsed = parseInt(c);
      if (isNaN(parsed)) return null;
      return parsed > 0 && parsed < 1000 ? parsed : null;
    });

  yield new Argument('sides')
    .setPrompt('How many sides should these dice have?')
    .setRePrompt('Please choose a number of sides.')
    .setResolver(resolvers.integer);
};

exports.triggers = [
  'dice',
  'roll'
];
