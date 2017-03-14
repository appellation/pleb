/**
 * Created by Will on 12/2/2016.
 */

const Operator = require('../util/audio/PlaylistOperator');
const Playlist = require('../util/audio/Playlist');

exports.func = async (res, msg, args) => {
    const pl = new Playlist();
    await pl.yt.loadPlaylistQuery(args.join(' '));
    const op = await Operator.init(msg.member, pl);
    return op.start(res);
};

exports.validator = val => val.ensureCanPlay();