const rp = require('request-promise-native');

exports.exec = async (cmd) => {
    const doge = await rp.get('http://shibe.online/api/shibes?count=1&httpsurls=true').then(JSON.parse);
    return cmd.response.success('', { file: doge[0] });
};