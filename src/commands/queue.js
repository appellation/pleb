const Playlist = require('../audio/Playlist');

module.exports = class {
    constructor({ bot }) {
        this.bot = bot;
    }

    exec(cmd) {
        const list = Playlist.get(this.bot, cmd.message.guild),
            perPage = 5,
            pos = cmd.args.page || (list.pos * perPage),
            part = list.songs.slice(pos, pos + perPage);

        return cmd.response.send(part.reduce((prev, song, index) => {
            return `${prev}**${index + pos + 1}** of ${list.length} - \`${song.title}\`\n`;
        }, cmd.args.song ? `Page **${Math.floor(pos/perPage) + 1}** of **${Math.ceil(list.length/perPage)}**\n` : '⭐ '));
    }

    * arguments(Argument) {
        yield new Argument('page')
            .setOptional()
            .setResolver(c => !c || isNaN(c) ? null : parseInt(c));
    }

    validate(val) {
        return val.ensurePlaylist(this.bot);
    }
};
