/**
 * Created by Will on 2/9/2017.
 */
exports.func = (res, msg, args) => {
    if(!msg.channel.permissionsFor(msg.client.user).hasPermission('MANAGE_CHANNELS'))
        return res.error('I don\'t have perms to ~~brutally murder~~ mute you if you lose.');
    if(msg.member.hasPermission('ADMINISTRATOR') || msg.member.id === msg.guild.ownerID)
        return res.error('awwww, admin is cheating.');

    if(Math.random() < 0.5) return res.send(`${msg.author} lives!`);
    return msg.channel.overwritePermissions(msg.author, { SEND_MESSAGES: false }).then(() => {
        setTimeout(() => {
            msg.channel.overwritePermissions(msg.author, { SEND_MESSAGES: null });
        }, 10000);
        return res.send(`${msg.author} lies dead in chat.`);
    }).catch(() => {
        return res.error('WHO LOADED THE GUN WITH BLANKS⁉ (I couldn\'t mute for some reason)');
    });
};