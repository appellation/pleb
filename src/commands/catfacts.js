/**
 * created by Will on 10/9/2016.
 */

const rp = require('request-promise-native');

exports.func = (res) => rp.get('http://catfacts-api.appspot.com/api/facts').then(JSON.parse).then(cats => {
    return res.success(cats.facts[0]);
});