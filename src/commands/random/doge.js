const request = require('axios');

exports.exec = async (cmd) => {
    const doge = await request.get('http://shibe.online/api/shibes?count=1&httpsurls=true');
    return cmd.response.success('', { file: doge[0] });
};
