exports.exec = (cmd) => {
  const mentions = cmd.message.mentions;
  const out = [];

  for (const [, user] of mentions.users) {
    if (user.equals(cmd.message.client.user)) continue;
    out.push(`${user}: \`${user.id}\``);
  }

  for (const [, channel] of mentions.channels) {
    out.push(`${channel}: \`${channel.id}\``);
  }

  for (const [, role] of mentions.roles) {
    out.push(`${role}: \`${role.id}\``);
  }

  if (out.length === 0) out.push(`${cmd.message.author}: \`${cmd.message.author.id}\``);
  return cmd.response.success(`**Requested IDs:**\n\n${out.join('\n')}`);
};
