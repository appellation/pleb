const { Command } = require('discord-handles');

module.exports = class extends Command {
  static get triggers() {
    return ['link', 'invite'];
  }

  exec() {
    return this.response.success('<https://discordapp.com/oauth2/authorize?permissions=3197952&scope=bot&client_id=218227587166502923>');
  }
};
