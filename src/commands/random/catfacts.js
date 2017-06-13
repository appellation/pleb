const request = require('axios');

exports.exec = async (cmd) => {
  const res = await request.get('http://catfacts-api.appspot.com/api/facts');
  return cmd.response.success(res.data.facts[0]);
};
