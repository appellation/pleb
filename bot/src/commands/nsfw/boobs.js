const request = require('axios');
const { Command, Validator } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Validator(this).ensureNSFW();
  }

  async exec() {
    try {
      const res = await request.get('http://api.oboobs.ru/boobs/0/1/random');
      const boobs = res.data[0];
      return this.response.send(`http://media.oboobs.ru/${boobs.preview}${boobs.model ? ` **Model:** ${boobs.model}` : ''}`);
    } catch (e) {
      return this.response.error('no boobs found 😭');
    }
  }
};
