const { MessageMentions } = require('discord.js');

exports.user = c => MessageMentions.USERS_PATTERN.test(c) ? c.match(MessageMentions.USERS_PATTERN)[0] : null;
exports.integer = c => !c || isNaN(c) ? null : parseInt(c);
