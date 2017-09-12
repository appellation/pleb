const request = require('axios');
const { Command } = require('discord-handles');

module.exports = class extends Command {
  async exec() {
    const response = await request('https://icanhazdadjoke.com/', {
      headers: {
        Accept: 'application/json'
      }
    });

    return this.response.send(response.data.joke);
  }
};
