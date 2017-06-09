const Playlist = require('../../core/audio/Playlist');

module.exports = class {
    constructor({ bot }) {
        this.bot = bot;
    }

    async exec(cmd) {
        const list = Playlist.get(this.bot, cmd.message.guild);
        if (cmd.args.query) await list.add(cmd.args.query);
        list.stop();
        list.shuffle();
        return list.start(cmd.response);
    }

    validate(val) {
        return val.ensurePlaylist(this.bot);
    }

    * arguments(Argument) {
        yield new Argument('query')
            .setOptional()
            .setInfinite();
    }
};
