const request = require('axios');
const { Command, Validator } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Validator(this).ensureNSFW();
  }

  async exec() {
    try {
      const res = await request.get('http://api.obutts.ru/butts/0/1/random');
      const butts = res.data[0];
      return this.response.send(`http://media.obutts.ru/${butts.preview}${butts.model ? ` **Model:** ${butts.model}` : ''}`);
    } catch (e) {
      return this.response.error('no ass found 😭');
    }
  }
};
