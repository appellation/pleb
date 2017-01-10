/**
 * Created by Will on 12/1/2016.
 */

const storage = require('../util/storage/playlists');

exports.func = (msg, args) => {
    const playlist = storage.get(msg.guild.id);

    const perPage = 5;
    const parsed = parseInt(args[0]);
    const pos = !args[0] ? playlist.list.pos : (parsed - 1) * perPage;

    const list = playlist.list.list;
    const part = list.slice(pos, pos + perPage);
    return part.reduce((prev, song, index) => {
        return `${prev}**${index + pos + 1}** of ${list.length} - \`${song.name}\`\n`;
    },
        args[0] ? `Page **${Math.floor(pos/perPage + 1)}** of **${Math.ceil(list.length/perPage)}**\n` : '⭐ '
    );
};

exports.validator = (msg, args) => {
    const parsed = parseInt(args[0]);
    return msg.guild && storage.has(msg.guild.id) && (args[0] ? (!isNaN(parsed) && parsed > 0) : true);
};