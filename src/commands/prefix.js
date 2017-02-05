/**
 * Created by Will on 1/28/2017.
 */
const storage = require('../util/storage/settings');
const command = require('../util/command');

exports.func = (res, msg) => {
    res.success(`Current prefix is: \`${storage.get(msg.guild.id).data.prefix}\``);
};

exports.validator = val => val.ensureGuild();