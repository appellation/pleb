/**
 * Created by Will on 12/2/2016.
 */

const Operator = require('../util/audio/PlaylistOperator');
const Playlist = require('../util/audio/Playlist');

exports.func = (res, msg, args) => {
    const pl = new Playlist();
    return pl.yt.loadPlaylistQuery(args.join(' ')).then(() => Operator.init(msg.member, pl))
        .then(op => op.start(res));
};

exports.validator = val => val.ensureCanPlay();