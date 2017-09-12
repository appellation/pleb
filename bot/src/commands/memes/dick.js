const resolvers = require('../../util/resolvers');
const { Argument, Command } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Argument(this, 'user')
      .setOptional()
      .setResolver(resolvers.user);
  }

  exec() {
    const user = this.args.user || this.message.author;
    let count;

    if ('dick' in user) {
      count = user.dick;
    } else {
      count = Math.floor(Math.random() * 69) + 1;
      user.dick = count;
    }

    return this.response.send(`8${'='.repeat(count)}D ${user}`);
  }
};
