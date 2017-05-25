module.exports = class {
    constructor({ bot }) {
        this.bot = bot;
    }

    exec(cmd) {
        const operator = this.bot.playlists.get(cmd.message.guild.id);
        operator.playlist.shuffle();
        return operator.start(cmd.response);
    }

    validate(val) {
        return val.ensurePlaylist(this.bot);
    }
};
