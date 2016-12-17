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
        return args.length > 0 && !isNaN(parseFloat(args[0])) && parseFloat(args[0]) < 30 && storage.has(msg.guild.id)
    }
};