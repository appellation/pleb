/**
 * Created by Will on 10/29/2016.
 */

const packageJSON = require('../../package.json');

exports.func = async (res, msg) => {
    return msg.author.sendMessage('**Bot Info:**\n' +
        'Version: `' + packageJSON.version + '`\n' +
        'Author: `Will Nelson <appellation@topkek.pw>`\n' +
        'Contributors: <https://github.com/appellation/pleb/graphs/contributors>\n' +
        'Help: `@Pleb help`\n' +
        'Licence: `' + packageJSON.license + '`\n' +
        'Repository: <https://github.com/appellation/pleb>\n\n' +
        '**Runtime Info:**\n' +
        'Language: `Javascript`\n' +
        'Node.JS version: `' + process.version + '`\n' +
        'v8 version: `' + process.versions.v8 + '`\n');
};