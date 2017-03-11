/**
 * Created by Will on 10/29/2016.
 */

exports.func = (res, msg, args) => {
    let num = parseInt(args[0], 10) || 3;
    if(isNaN(num)) return;

    return msg.channel.fetchMessages().then(collection => {
        let messages = collection.findAll('author', msg.client.user).slice(0, num);
        if(messages.length === 1) return messages[0].delete().then(() => res.success('Purged last message.', msg.author));
        if(messages.length === 0) return res.error('No messages found that could be purged.', msg.author);

        return msg.channel.bulkDelete(messages).then(deleted => {
            return res.success(`Purged last ${deleted.size} messages.`, msg.author);
        });
    });
};

exports.triggers = [
    'sanitize',
    'purge',
    'clean'
];