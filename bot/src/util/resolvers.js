const { MessageMentions } = require('discord.js');

exports.user = (c, m) => MessageMentions.USERS_PATTERN.test(c) ? m.client.users.get(c.match(MessageMentions.USERS_PATTERN)[0]) : null;
exports.integer = c => !c || isNaN(c) ? null : parseInt(c);
