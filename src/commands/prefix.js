/**
 * Created by Will on 1/28/2017.
 */
const storage = require('../util/storage/settings');

exports.func = async (res, msg) => {
    return res.success(`Current prefix is: \`${storage.get(msg.guild.id).get('prefix')}\``);
};

exports.validator = val => val.ensureGuild();