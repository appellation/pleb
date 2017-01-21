/**
 * Created by Will on 12/17/2016.
 */

const settings = require('./storage/settings');

const idPattern = `^<@!?${process.env.discord_client_id}>\\s*`;
module.exports = {
    nsfwAllowed: message => {
        return !!(message.channel.type === 'dm' || message.member.roles.find(role => role.name.toLowerCase() === 'nsfw') || message.channel.name.toLowerCase() === 'nsfw');
    },
    fetchPrefix: guild => {
        if(!guild) return new RegExp('');
        return new RegExp(`^(${(settings.has(guild.id) && settings.get(guild.id).data.prefix) ? RegExp.escape(settings.get(guild.id).data.prefix) : ''}|${idPattern})\\s*`);
    }
};