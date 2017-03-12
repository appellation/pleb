/**
 * Created by nelso on 1/20/2017.
 *
 */

const storage = require('../util/storage/settings');
const allowedSettings = new Set([
    'prefix'
]);

exports.func = async (res, msg, args) => {
    if(!allowedSettings.has(args[0].toLowerCase())) return;

    const settings = storage.get(msg.guild.id),
        key = args[0],
        value = args.slice(1).join(' ') || null;

    await settings.set(key, value);
    return res.success(`**${key}** set to \`${value}\``);
};

exports.validator = val => val.ensureGuild() && val.ensureArgs();