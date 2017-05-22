module.exports = class {
    constructor({ bot }) {
        this.bot = bot;
        this.triggers = [
            'stfu',
            'stop',
            'leave'
        ];
    }

    exec(cmd) {
        const operator = this.bot.playlists.get(cmd.message.guild.id);
        if (operator) operator.destroy();

        if (cmd.message.guild.voiceConnection) cmd.message.guild.voiceConnection.disconnect();
        return cmd.response.send('k 😢');
    }
};
