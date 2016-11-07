/**
 * Created by Will on 9/24/2016.
 */

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {string}
 */
function Id(client, msg, args)  {
    const mentions = msg.mentions;

    if(mentions.size == 0)  {
        return '`' + msg.author.id + '`';
    }

    let out = [];
    for(const channel of mentions.channels) {
        out.push(channel[1] + ': `' + channel[1].id +'`');
    }

    for(const role of mentions.roles)   {
        out.push(role[1] + ': `' + role[1].id + '`');
    }

    return out.join('\n');
}

module.exports = Id;