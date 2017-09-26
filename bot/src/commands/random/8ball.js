const { element } = require('../../util/random');
const { Argument, Command } = require('discord-handles');

const responses = [
  'It is certain',
  'It is decidedly so',
  'Without a doubt',
  'Yes, definitely',
  'You may rely on it',
  'As I see it, yes',
  'Most likely',
  'Outlook good',
  'Yes',
  'Signs point to yes',
  'Reply hazy try again',
  'Ask again later',
  'Better not tell you now',
  'Cannot predict now',
  'Concentrate and ask again',
  'Don\'t count on it',
  'My reply is no',
  'My sources say no',
  'Outlook not so good',
  'Very doubtful'
];

module.exports = class extends Command {
  async pre() {
    await new Argument(this, 'question')
      .setPrompt('What would you like to ask?')
      .setRePrompt('That\'s not a valid question.')
      .setInfinite()
      .setResolver(c => c || null);
  }

  exec() {
    return this.response.send(`🎱 ${element(responses)}`);
  }
};
