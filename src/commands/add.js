/**
 * Created by Will on 9/11/2016.
 */

const storage = require('../util/storage/playlists');
const Operator = require('../util/audio/PlaylistOperator');

exports.func = async (res, msg, args) => {
    const next = args[0] === 'next';
    if(storage.has(msg.guild.id)) {
        const operator = await storage.get(msg.guild.id).add(next ? args.slice(1) : args);
        const pl = operator.playlist;
        if(next) pl.list.splice(pl.pos, 0, pl.list.pop());
        return res.success(`added \`${next ? pl.getNext().name : pl.getLast().name}\``);
    }

    return Operator.startNew(args, res, msg.member);
};

exports.validator = val => {
    return val.ensureArgs();
};