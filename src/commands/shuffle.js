module.exports = class {
    constructor({ bot }) {
        this.bot = bot;
    }

    exec(cmd) {
        const list = this.bot.playlists.get(cmd.message.guild.id);
        list.shuffle();
        return list.start(cmd.response);
    }

    validate(val) {
        return val.ensurePlaylist(this.bot);
    }
};
