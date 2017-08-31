const axios = require('axios')

exports.exec = (cmd) => {
  const fact = await axios.get('https://dog-api.kinduff.com/api/facts');
  if (fact.data.success) cmd.response.success(fact.data.facts[0]);
  else cmd.response.error('error fetching a dog fact');
};
