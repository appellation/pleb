module.exports = class {
    constructor({ bot }) {
        this.bot = bot;
    }

    exec(cmd) {
        return this.bot.playlists.get(cmd.message.guild.id).pause();
    }

    validate(val) {
        return val.ensurePlaylist(this.bot);
    }
};
