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
    if(!args[0]) return msg.author.id;

    const mentions = msg.mentions;
    let out = [];
    for(const user of mentions.users)   {
        if(user[1].equals(client.user)) continue;
        out.push(user[1] + ': `' + user[1].id + '`');
    }

    for(const channel of mentions.channels) {
        out.push(channel[1] + ': `' + channel[1].id +'`');
    }

    for(const role of mentions.roles)   {
        out.push(role[1] + ': `' + role[1].id + '`');
    }

    return out.join('\n');
}

module.exports = {
    triggers: 'id',
    func: Id
};