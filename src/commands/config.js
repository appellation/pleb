/**
 * Created by nelso on 1/20/2017.
 *
 */

const storage = require('../util/storage/settings');
const allowedSettings = new Set([
    'prefix'
]);

exports.func = (msg, args) => {
    if(!allowedSettings.has(args[0].toLowerCase())) return;
    const settings = storage.get(msg.guild.id);
    return settings.set(args[0], args.slice(1).join(' ') || null).then(config => {
        return `**${args[0]}** set to \`${config[args[0]]}\``;
    });
};

exports.validator = (msg, args) => msg.channel.type === 'text' && args.length >= 1;