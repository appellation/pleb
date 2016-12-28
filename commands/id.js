/**
 * Created by Will on 9/24/2016.
 */

exports.func = msg => {
    const mentions = msg.mentions;
    let out = [];

    for(const [, user] of mentions.users)   {
        if(user.equals(msg.client.user)) continue;
        out.push(user + ': `' + user.id + '`');
    }

    for(const [, channel] of mentions.channels) {
        out.push(channel + ': `' + channel.id +'`');
    }

    for(const [, role] of mentions.roles)   {
        out.push(role + ': `' + role.id + '`');
    }

    return out.join('\n');
};

exports.validator = (msg, args) => {
    return args.length > 0;
};
