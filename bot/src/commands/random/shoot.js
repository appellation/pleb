const resolvers = require('../../util/resolvers');
const { Argument, Command } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Argument(this, 'user')
      .setPrompt('Who would you like to shoot?')
      .setRePrompt('Please provide a valid user to shoot.')
      .setResolver(resolvers.user);
  }

  exec() {
    const self = this.args.user.match(/\d+/)[0] === this.author.id;
    if (Math.random() < 0.5) this.response.send(`${this.author} shot ${self ? 'themselves' : this.args.user}!`);
    else this.response.send(`${this.author} tried to kill ${self ? 'themselves' : this.args.user} but missed. 👀`);
  }
};
