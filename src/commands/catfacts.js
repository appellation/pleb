/**
 * created by Will on 10/9/2016.
 */

const rp = require('request-promise-native');

exports.func = async (res) => {
    const cats = await rp.get('http://catfacts-api.appspot.com/api/facts').then(JSON.parse);
    return res.success(cats.facts[0]);
};