const { roll } = require('../../util/random');

exports.exec = (cmd) => cmd.response.success(roll(1, 2) === 1 ? 'heads' : 'tails');
