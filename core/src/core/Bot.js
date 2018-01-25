const { default: Spectacles } = require('@spectacles/spectacles.js');

module.exports = class Bot extends Spectacles {
  constructor(app) {
    super(process.env.discord);
    this.app = app;
    this.app.context.bot = this;
  }
};
