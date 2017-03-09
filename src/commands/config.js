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
    const settings = storage.get(msg.guild.id);
    const config = await settings.set(args[0], args.slice(1).join(' ') || null);
    return res.success(`**${args[0]}** set to \`${config[args[0]]}\``);
};

exports.validator = val => val.ensureGuild() && val.ensureArgs();