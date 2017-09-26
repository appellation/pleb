const packageJSON = require('../../../package.json');
const { Command } = require('discord-handles');

module.exports = class extends Command {
  exec() {
    return this.response.dm(`${'**Bot Info:**\n' +
      'Version: `'}${ packageJSON.version }\`\n` +
      'Author: `Will Nelson <appellation@topkek.pw>`\n' +
      'Help: `@Pleb help`\n' +
      '**Runtime Info:**\n' +
      'Language: `Javascript`\n' +
      `Node.JS version: \`${ process.version }\`\n` +
      `v8 version: \`${ process.versions.v8 }\`\n`);
  }
};
