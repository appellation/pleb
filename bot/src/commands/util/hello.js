const { Command } = require('discord-handles');

module.exports = class extends Command {
  static get triggers() {
    return ['hello', 'hi', 'hey', 'sup', 'wassup'];
  }

  exec() {
    this.message.react('👋');
  }
};
