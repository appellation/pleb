/**
 * Created by Will on 2/12/2017.
 */
const Thonk = require('../util/providers/RethinkProvider');
module.exports = client => {
    if(process.env.rethink) {
        client.provider = new Thonk(client);
        client.provider.initializeGuilds();
    }
};