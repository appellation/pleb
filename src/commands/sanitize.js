/**
 * Created by Will on 10/29/2016.
 */

exports.func = async (res, msg, args) => {
    let num = parseInt(args[0], 10) || 3;
    if(isNaN(num)) return;

    const collection = await msg.channel.fetchMessages();
    let messages = collection.array().filter(m => m.author.id === msg.client.user.id).slice(0, num);
    if(messages.length < 1) return res.error('Unable to find any messages to purge.');
    if(messages.length === 1) {
        await messages[0].delete();
        return res.success('Purged last message.', msg.author);
    }
    const deleted = await msg.channel.bulkDelete(messages);
    return res.success(`Purged last ${deleted.size} messages.`, msg.author);
};

exports.triggers = [
    'sanitize',
    'purge',
    'clean'
];