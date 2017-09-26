const { Command } = require('discord-handles');

module.exports = class extends Command {
  exec() {
    return this.response.send('https://cdn.discordapp.com/attachments/303970987387518987/306625985674084363/giphy.gif');
  }
};
