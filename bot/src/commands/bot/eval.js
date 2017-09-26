const { Argument, Command, Validator } = require('discord-handles');

module.exports = class extends Command {
  async pre() {
    await new Validator(this).ensureIsOwner();
    await new Argument(this, 'code')
      .setPrompt('What code would you like to eval?')
      .setResolver(c => c || null)
      .setInfinite();
  }

  async exec() {
    let res;
    try {
      res = await eval(this.args.code);
    } catch (e) {
      res = e.message;
    }

    const inspected = require('util').inspect(res, { depth: 1 });
    return (inspected.length <= 6000) ? this.response.send(inspected, undefined, { split: true, code: 'js' }) : this.response.error('that response would be too big');
  }
};
