/**
 * Created by Will on 10/29/2016.
 */

/*
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {Promise}
 * @constructor
 */
function sanitize(msg, args)    {
    let num = parseInt(args[0], 10) || 10;

    return msg.channel.fetchMessages().then(collection => {
        let messages = collection.findAll('author', msg.client.user);
        if(messages.length <= 1) return;

        return msg.channel.bulkDelete(messages.slice(0, num));
    });
}

module.exports = {
    func: sanitize,
    triggers: [
        'sanitize',
        'purge',
        'clean'
    ],
    validator: (msg, args) => {
        const parsed = parseInt(args[0]);
        return !isNaN(parsed) && parsed > 1;
    }
};