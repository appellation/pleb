const { Command } = require('discord-handles');

module.exports = class extends Command {
  async exec() {
    const newMessage = await this.response.send('pinging....');
    if (!newMessage) return;
    return this.response.success(`\`${newMessage.createdTimestamp - this.message.createdTimestamp} ms\` round-trip ⏱ | \`${Math.round(this.client.ping)} ms\` heartbeat 💓`);
  }
};
