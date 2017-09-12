const { roll } = require('../../util/random');
const { Command } = require('discord-handles');

module.exports = class extends Command {
  exec() {
    return this.response.success(roll(1, 2) === 1 ? 'heads' : 'tails');
  }
};
