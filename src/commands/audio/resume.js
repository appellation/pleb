module.exports = class {
    constructor({ bot }) {
        this.bot = bot;
    }

    exec(cmd) {
        return this.bot.playlists.get(this.bot, cmd.message.guild).resume();
    }

    validate(val) {
        return val.ensurePlaylist(this.bot);
    }
};
