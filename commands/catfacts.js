/**
 * created by Will on 10/9/2016.
 */

const rp = require('request-promise-native');
module.exports = {
    func: () => rp.get('http://catfacts-api.appspot.com/api/facts').then(JSON.parse).then(res => res.facts[0]),
    triggers: 'catfacts'
};