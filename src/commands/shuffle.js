/**
 * Created by Will on 9/7/2016.
 */

const Operator = require('../util/audio/PlaylistOperator');
const Playlist = require('../util/audio/Playlist');
const storage = require('../util/storage/playlists');

exports.func = async (res, msg, args) => {
    if(args.length > 0) {
        const pl = new Playlist();
        const operator = await pl.add(args).then(() => Operator.init(msg.member, pl));
        // console.log(operator.playlist);
        operator.playlist.shuffle();
        return operator.start(res);
    } else {
        const operator = storage.get(msg.guild.id);
        operator.playlist.shuffle();
        return operator.start(res);
    }
};

exports.validator = val => val.ensurePlaylist() || (val.ensureArgs() && val.ensureCanPlay());
