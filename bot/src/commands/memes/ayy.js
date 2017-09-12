const { Command } = require('discord-handles');

module.exports = class extends Command {
  static get triggers() {
    return /^ay+$/i;
  }

  exec() {
    return this.response.send('lmao');
  }
};
