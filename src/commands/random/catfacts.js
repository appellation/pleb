const request = require('axios');

exports.exec = async (cmd) => {
  const res = await request.get('https://catfact.ninja/fact');
  return cmd.response.success(res.data.fact);
};
