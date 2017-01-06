/**
 * Created by Will on 12/17/2016.
 */

module.exports = {
    nsfwAllowed: message => {
        return !!(message.channel.type === 'dm' || message.member.roles.find(role => role.name.toLowerCase() === 'nsfw') || message.channel.name.toLowerCase() === 'nsfw' || );
    }
};