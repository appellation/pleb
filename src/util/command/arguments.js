const { Argument } = require('discord-handles');
const { MessageMentions } = require('discord.js');

exports.user = () => new Argument('user')
    .setOptional()
    .setResolver(c => MessageMentions.USERS_PATTERN.test(c) ? c.match(MessageMentions.USERS_PATTERN)[0] : null);
