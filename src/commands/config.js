const { Argument } = require('discord-handles');
const storage = require('../util/storage/settings');
const allowedSettings = new Set([
    'prefix'
]);

exports.exec = async (cmd) => {
    const settings = storage.get(cmd.message.guild.id);

    await settings.set(cmd.args.key, cmd.args.value);
    return cmd.response.success(`**${cmd.args.key}** set to \`${cmd.args.value}\``);
};

exports.arguments = function* () {
    const settings = Array.from(allowedSettings.values()).join(', ');
    const key = yield new Argument('key')
        .setPrompt(`What setting would you like to modify? \`${settings}\``)
        .setRePrompt(`That setting wasn't valid.  Please try again.  \`${settings}\``)
        .setResolver(c => allowedSettings.has(c.toLowerCase()) ? c.toLowerCase() : null);

    yield new Argument('value')
        .setPrompt(`What would you like to set ${key} to?`)
        .setPattern(/.*/);
};

// exports.validate = val => val.ensureGuild() && val.ensureArgs();
