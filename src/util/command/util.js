/**
 * Created by Will on 12/17/2016.
 */

const settings = require('./../storage/settings');

const idPattern = `^<@!?${process.env.discord_client_id}>\\s*`;
module.exports = {
    fetchPrefix: guild => {
        if(!guild) return new RegExp('');
        return new RegExp(`^(${(settings.has(guild.id) && settings.get(guild.id).getCached('prefix') ? `${RegExp.escape(settings.get(guild.id).getCached('prefix'))}|` : '') + idPattern})\\s*`);
    }
};