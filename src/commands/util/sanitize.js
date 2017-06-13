const resolvers = require('../../util/resolvers');

exports.exec = async ({ response: res, message: msg, args }) => {
  const collection = await msg.channel.fetchMessages();
  const messages = collection.array().filter(m => m.author.id === msg.client.user.id).slice(0, args.count || 3);
  if (messages.length < 1) return res.error('Unable to find any messages to purge.');
  if (messages.length === 1) {
    await messages[0].delete();
    return res.success('Purged last message.', msg.author);
  }
  if (!msg.channel.permissionsFor(msg.client.user).has('MANAGE_MESSAGES')) return res.error('I need `Manage Messages` permissions to sanitize.');
  const deleted = await msg.channel.bulkDelete(messages);
  return res.success(`Purged last ${deleted.size} messages.`, msg.author);
};

exports.arguments = function* (Argument) {
  yield new Argument('count')
    .setRePrompt('Please provide a valid number of messages to sanitize.')
    .setOptional()
    .setResolver(resolvers.integer);
};

exports.triggers = [
  'sanitize',
  'purge',
  'clean'
];
