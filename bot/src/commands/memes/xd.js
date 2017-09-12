const path = require('path');
const { Command } = require('discord-handles');

module.exports = class extends Command {
  static get triggers() {
    return ['xD', 'XD'];
  }

  exec() {
    return this.response.send(undefined, undefined, { files: [path.join(__dirname, '..', '..', '..', 'assets', 'images', 'xd.gif')] });
  }
};
