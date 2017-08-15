const path = require('path');

exports.exec = (cmd) => {
  return cmd.response.send(void 0, { files: [path.join(__dirname, '..', '..', '..', 'assets', 'images', 'xd.gif')] });
};

exports.triggers = [
  'xD',
  'XD'
];
