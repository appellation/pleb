const Playlist = require('../audio/Playlist');

module.exports = class {
    constructor({ bot }) {
        this.bot = bot;
        this.triggers = ['next', 'skip'];
    }

    exec(cmd) {
        const list = Playlist.get(this.bot, cmd.message.guild);
        for (let i = 0; i < (cmd.args.count || 1) && list.hasNext(); i++) list.next();
        return list.start(cmd.response);
    }

    * arguments(Argument) {
        yield new Argument('count')
            .setOptional()
            .setResolver(c => isNaN(c) ? null : parseInt(c));
    }

    validate(val) {
        return val.ensurePlaylist(this.bot);
    }
};
