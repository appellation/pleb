/**
 * Created by Will on 10/29/2016.
 */

exports.func = (res, msg, args) => {
    let num = parseInt(args[0], 10) || 3;
    if(isNaN(num)) return;

    return msg.channel.fetchMessages().then(collection => {
        let messages = collection.findAll('author', msg.client.user);
        if(messages.length <= 1) return res.error('Unable to purge less than 2 messages.', msg.author);

        return msg.channel.bulkDelete(messages.slice(0, num));
    }).then(deleted => {
        return res.success(`Purged last ${deleted.size} messages.`, msg.author);
    });
};

exports.triggers = [
    'sanitize',
    'purge',
    'clean'
];