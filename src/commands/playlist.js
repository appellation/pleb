const { Argument } = require('discord-handles');
const Operator = require('../util/audio/PlaylistOperator');
const Playlist = require('../util/audio/Playlist');

exports.exec = async ({ response: res, message: msg, args}) => {
    const pl = new Playlist();
    await res.send('adding playlist...');
    await pl.yt.loadPlaylistQuery(args.list);
    const op = await Operator.init(msg.member, pl);
    return op.start(res);
};

exports.arguments = function* () {
    yield new Argument('list')
        .setPrompt('What playlist would you like to search for?')
        .setPattern(/.*/);
};

exports.disabled = true;

exports.validator = val => val.ensureCanPlay();
