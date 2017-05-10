const storage = require('../util/storage/playlists');

exports.exec = ({response: res, message: msg, args}) => {
    const operator = storage.get(msg.guild.id);

    const perPage = 5;
    const parsed = args.song;
    const pos = isNaN(parsed) ? operator.playlist.pos - 1 : (parsed - 1) * perPage;

    const list = operator.playlist.list;
    const part = list.slice(pos, pos + perPage);
    return res.send(part.reduce((prev, song, index) => {
        return `${prev}**${index + pos + 1}** of ${list.length} - \`${song.title}\`\n`;
    },
        args.song ? `Page **${Math.floor(pos/perPage) + 1}** of **${Math.ceil(list.length/perPage)}**\n` : '⭐ '
    ));
};

exports.arguments = function* (Argument) {
    yield new Argument('page')
        .setOptional()
        .setResolver(c => !c || isNaN(c) ? null : parseInt(c));
};

exports.validator = val => val.ensurePlaylist();
