/**
 * Created by Will on 12/22/2016.
 */

const Playlist = require('../util/audio/Playlist');
const Operator = require('../util/audio/PlaylistOperator');

exports.func = async (res, msg, args) => {
    const pl = new Playlist();
    const op = await pl.add(args).then(list => Operator.init(msg.member, list));
    const first = op.playlist.list;

    for(let i = 1; i < parseInt(args[0]) || 20; i++) op.playlist.list = op.playlist.list.concat(first);
    op.start(res);
};

exports.validator = (val, cmd) => val.ensureGuild() && val.applyValid(isNaN(cmd.args[0]) ? true : parseInt(cmd.args[0]) < 50, 'Cannot loop more 50 or more times.');

exports.disabled = true;
