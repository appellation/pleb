const request = require('axios');
const { Argument, Command } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Argument(this, 'word')
      .setResolver(c => c || null)
      .setPattern(/.*/)
      .setPrompt('What would you like to define?');
  }

  async exec() {
    const res = await request.get('http://api.pearson.com/v2/dictionaries/ldoce5/entries', {
      params: {
        headword: this.args.word
      }
    });

    let out = '';
    for (const detail of res.data.results) {
      out += '➡ ';

      if (detail.part_of_speech) {
        out += `\`${detail.part_of_speech}\` `;
      }
      out += `**${detail.headword}**`;

      if (detail.pronunciations)
        for (const pro of detail.pronunciations)
          out += ` / \`${pro.ipa}\``;

      out += '\n';

      if (detail.senses) {
        for (const sense of detail.senses) {

          if (sense.definition)
            for (let i = 0; i < sense.definition.length; i++)
              out += `\t${i+1}. *${sense.definition[i]}*\n`;

          if (sense.examples)
            for (const ex of sense.examples)
              out += `\tex: "${ex.text}"\n`;
        }
      }

      out += '\n';
    }

    return out ? this.response.send(out) : this.response.error('no results found');
  }
};
