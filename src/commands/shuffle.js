/**
 * Created by Will on 9/7/2016.
 */

const Playlist = require('../util/audio/PlaylistOperator');
const storage = require('../util/storage/playlists');

exports.func = (msg, args) => {
    if(args.length > 0) {
        return Playlist.init(msg, args).then(operator => {
            operator.initializeMessage(msg.channel);
            operator.list.shuffle();
            operator.playQueue();
        });
    }   else    {
        const playlist = storage.get(msg.guild.id);
        playlist.shuffle();
    }
};
