/**
 * Created by Will on 12/1/2016.
 */

const storage = require('../util/storage/playlists');

exports.func = async (res, msg, args) => {
    const operator = storage.get(msg.guild.id);

    const perPage = 5;
    const parsed = parseInt(args[0]);
    const pos = isNaN(parsed) ? operator.playlist.pos - 1 : (parsed - 1) * perPage;

    const list = operator.playlist.list;
    const part = list.slice(pos, pos + perPage);
    return res.send(part.reduce((prev, song, index) => {
        return `${prev}**${index + pos + 1}** of ${list.length} - \`${song.title}\`\n`;
    },
        args[0] ? `Page **${Math.floor(pos/perPage) + 1}** of **${Math.ceil(list.length/perPage)}**\n` : '⭐ '
    ));
};

exports.validator = val => val.ensurePlaylist();
