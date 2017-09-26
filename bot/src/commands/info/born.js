const moment = require('moment');
const { Command } = require('discord-handles');

module.exports = class extends Command {
  exec() {
    return this.response.success(`${this.message.author} you were born on ${moment(this.message.author.createdTimestamp).format('MMMM Do, YYYY [at] h:mm:ss a')}`);
  }
};
