/**
 * Created by Will on 1/18/2017.
 */

let thonk = require('../util/providers/RethinkProvider');
thonk = new thonk();
const g = require('../util/providers/GuildSettings');

exports.func = (msg) => {
    const settings = new g(thonk, msg.guild);
    settings.init();
};