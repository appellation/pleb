const rp = require('request-promise-native');

exports.exec = async (cmd) => {
    const cats = await rp.get('http://catfacts-api.appspot.com/api/facts').then(JSON.parse);
    return cmd.response.success(cats.facts[0]);
};
