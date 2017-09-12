const request = require('axios');
const { Command } = require('discord-handles');

module.exports = class extends Command {
  async exec() {
    const res = await request.get('https://catfact.ninja/fact');
    return this.response.success(res.data.fact);
  }
};
