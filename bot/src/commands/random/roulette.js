const { Command, Validator } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Validator(this)
      .ensureGuild()
      .ensureClientPermissions('MANAGE_CHANNELS')
      .apply(this.message.member.hasPermission('ADMINISTRATOR') || this.author.id === this.guild.ownerID, 'aww, admin is cheating.');
  }

  async exec() {
    if (Math.random() < 0.5) return this.response.send(`${this.author} lives!`);
    try {
      await this.channel.overwritePermissions(this.author, { SEND_MESSAGES: false });
      setTimeout(() => {
        this.channel.overwritePermissions(this.author, { SEND_MESSAGES: null });
      }, 30000);
      return this.response.send(`${this.author} lies dead in chat.`);
    } catch (e) {
      return this.response.error('WHO LOADED THE GUN WITH BLANKS⁉ (I couldn\'t mute for some reason)');
    }
  }
};
