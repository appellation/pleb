/**
 * Created by Will on 12/17/2016.
 */

const storage = require('../storage/playlists');

function Vol(msg, args) {
    storage.get(msg.guild.id).volume = parseFloat(args[0]) / 10;
}

module.exports = {
    func: Vol,
    triggers: [
        'vol',
        'volume'
    ],
    validator: (msg, args) => {
        const parsed = parseFloat(args[0]);
        return msg.guild && args.length > 0 && !isNaN(parsed) && Math.abs(parsed) <= 50 && storage.has(msg.guild.id)
    }
};