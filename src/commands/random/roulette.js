exports.exec = async ({ response: res, message: msg }) => {
    if (!msg.channel.permissionsFor(msg.client.user).hasPermission('MANAGE_CHANNELS'))
        return res.error('I don\'t have perms to ~~brutally murder~~ mute you if you lose.');
    if (msg.member.hasPermission('ADMINISTRATOR') || msg.member.id === msg.guild.ownerID)
        return res.error('awwww, admin is cheating.');

    if (Math.random() < 0.5) return res.send(`${msg.author} lives!`);
    try {
        await msg.channel.overwritePermissions(msg.author, { SEND_MESSAGES: false });
        setTimeout(() => {
            msg.channel.overwritePermissions(msg.author, { SEND_MESSAGES: null });
        }, 30000);
        return res.send(`${msg.author} lies dead in chat.`);
    } catch (e) {
        return res.error('WHO LOADED THE GUN WITH BLANKS⁉ (I couldn\'t mute for some reason)');
    }
};

exports.validator = val => val.ensureGuild();
