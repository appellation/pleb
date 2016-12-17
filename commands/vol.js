/**
 * Created by Will on 12/17/2016.
 */

const storage = require('../storage/playlists');

function Vol(msg, args) {
    storage.get(msg.guild.id).dispatcher.setVolume(parseFloat(args[0]) / 10);
}

module.exports = {
    func: Vol,
    triggers: [
        'vol',
        'volume'
    ],
    validator: (msg, args) => {
        return args.length > 0 && !isNaN(parseFloat(args[0])) && Math.abs(parseFloat(args[0])) <= 50 && storage.has(msg.guild.id)
    }
};