/**
 * Created by Will on 10/29/2016.
 */

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {Promise}
 * @constructor
 */
function Sanitize(client, msg, args)    {
    let num = parseInt(args[0], 10) || 10;

    return msg.channel.fetchMessages().then(collection => {
        let messages = collection.findAll('author', client.user);
        if(messages.length <= 1) return;

        return msg.channel.bulkDelete(messages.slice(0, num));
    });
}

module.exports = {
    func: Sanitize,
    triggers: [
        'sanitize',
        'purge',
        'clean'
    ]
};