/**
 * Created by Will on 1/14/2017.
 */

const Playlist = require('../util/audio/structures/Playlist');

let p = new Playlist();
exports.func = (msg, args) => {
    if(args.length === 0) return console.log(p);
    p = new Playlist();
    p.add(args).then(console.log);
};