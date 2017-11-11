const { promisify } = require('util');
const google = promisify(require('google'));
const { Command, Argument } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Argument(this, 'query')
      .setPrompt('What would you like to search for?')
      .setRePrompt('I can\'t search for that. Please try again.');
  }

  async exec() {
    const results = (await google(this.args.query)).links.filter(r => r.title && r.href);

    let out = '';
    const first = results.shift();
    out += `**${first.title}**\n<${first.href}>\n${first.description.replace(/\n/g, '')}\n\n`;
    out += results.slice(0, 2).map(r => `<${r.href}>`).join('\n');

    return this.response.success(out);
  }
};
