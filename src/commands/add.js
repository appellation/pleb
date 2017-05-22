module.exports = class {
    constructor({ bot }) {
        this.bot = bot;
    }

    exec(cmd) {
        return this.bot.playlists.get(cmd.message.guild.id).playlist.add(cmd.response, cmd.args.song);
    }

    * arguments(Argument) {
        yield new Argument('song')
            .setPrompt('What would you like to add?')
            .setPattern(/.*/);
    }

    validate(val) {
        return val.ensurePlaylist();
    }
};
