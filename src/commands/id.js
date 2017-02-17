/**
 * Created by Will on 9/24/2016.
 */

exports.func = (res, msg) => {
    const mentions = msg.mentions;
    let out = [];

    for(const [, user] of mentions.users) {
        if(user.equals(msg.client.user)) continue;
        out.push(user + ': `' + user.id + '`');
    }

    for(const [, channel] of mentions.channels) {
        out.push(channel + ': `' + channel.id +'`');
    }

    for(const [, role] of mentions.roles) {
        out.push(role + ': `' + role.id + '`');
    }

    if(out.length === 0) out.push(msg.author.id);
    return res.success(`**Requested IDs:**\n\n${out.join('\n')}`);
};
