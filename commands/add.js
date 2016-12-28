/**
 * Created by Will on 9/11/2016.
 */

const Play = require('../commands/play');
const storage = require('../storage/playlists');

exports.func = (msg, args, handler) => {
    if(args[0] === 'shuffle') {
        return Play.func(msg, args.slice(1), handler, {
            playlistIn: storage.get(msg.guild.id),
            shuffle: true
        });
    }   else {
        storage.get(msg.guild.id).add(args);
        return 'added';
    }
};

exports.validator = (msg, args) => {
    return msg.guild && !!(args[0] || storage.has(msg.guild.id));
};