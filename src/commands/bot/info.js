const packageJSON = require('../../../package.json');

exports.exec = (cmd) => {
  return cmd.response.dm(`${'**Bot Info:**\n' +
        'Version: `'}${ packageJSON.version }\`\n` +
        'Author: `Will Nelson <appellation@topkek.pw>`\n' +
        'Help: `@Pleb help`\n' +
        '**Runtime Info:**\n' +
        'Language: `Javascript`\n' +
        `Node.JS version: \`${ process.version }\`\n` +
        `v8 version: \`${ process.versions.v8 }\`\n`);
};
