const { Validator } = require('discord-handles');

const ERRORS = {
    ensureGuild: 'This command cannot be run outside of a guild.',
    ensureClientPermissions: perm => `Cannot ${perm.split('_').join(' ').toLowerCase()}.`,
    ensureArgs: 'No command arguments were provided.',
    ensureReplyable: 'Cannot send messages in that channel.',
    ensureMemberVoice: 'You\'re not in a voice channel.',
    ensureJoinable: 'Can\'t join your voice channel.',
    ensureSpeakable: 'Can\'t speak in your voice channel.',
    ensureCurrentVoiceChannel: 'Not currently connected to a voice channel.',
    ensurePlaylist: 'I\'m currently not playing anything.',
    ensureNSFW: 'This is not an NSFW channel.',
    ensureIsNumber: argNum => `Argument ${argNum + 1} must be a number.`
};

class Validate extends Validator {

    /**
     * Ensure the message is in a guild.
     * @return {*}
     */
    ensureGuild() {
        return super.apply(this.message.channel.type === 'text', ERRORS.ensureGuild);
    }

    /**
     * Ensure that the client has a permission resolvable.
     * @param resolvable
     * @return {boolean}
     */
    ensureClientPermissions(resolvable) {
        if (this.message.channel.type === 'dm') return super.apply(true);

        return this.ensureGuild() && super.apply(this.message.channel.permissionsFor(this.message.guild.member(this.message.client.user)).hasPermission(resolvable), ERRORS.ensureClientPermissions(resolvable));
    }

    ensurePlaylist(bot) {
        return this.ensureGuild() && (super.apply(bot.playlists.has(this.message.guild.id), ERRORS.ensurePlaylist) && this.ensureCurrentVoiceChannel());
    }

    /**
     * Ensure that some arguments exist.
     * @return {boolean}
     */
    ensureArgs() {
        return super.apply(Object.keys(this.command.args).length > 0, ERRORS.ensureArgs);
    }

    /**
     * Ensure that the client can send a text response.
     * @return {boolean}
     */
    ensureReplyable() {
        return this.ensureClientPermissions('SEND_MESSAGES');
    }

    /**
     * Ensure that the author is in a voice channel.
     * @return {boolean}
     */
    ensureMemberVoice() {
        return this.ensureGuild() && super.apply(this.message.member.voiceChannel, ERRORS.ensureMemberVoice);
    }

    /**
     * Ensure that the client can join the author's voice channel.
     * @return {boolean}
     */
    ensureJoinable() {
        return this.ensureMemberVoice() && super.apply(this.message.member.voiceChannel.joinable, ERRORS.ensureJoinable);
    }

    /**
     * Ensure that the client can speak in the author's voice channel.
     * @return {boolean}
     */
    ensureSpeakable() {
        return this.ensureMemberVoice() && super.apply(this.message.member.voiceChannel.speakable, ERRORS.ensureSpeakable);
    }

    ensureNSFW() {
        return super.apply(this.message.channel.nsfw, ERRORS.ensureNSFW);
    }

    ensureCanPlay() {
        return this.ensureJoinable() && this.ensureSpeakable();
    }

    /**
     * Ensure that the client is currently connected to a voice channel.
     * @return {boolean}
     */
    ensureCurrentVoiceChannel() {
        return this.ensureGuild() && super.apply(this.message.client.voiceConnections.has(this.message.guild.id), ERRORS.ensureCurrentVoiceChannel);
    }

    ensureIsNumber(argNum) {
        return super.apply(!isNaN(this.command.args[argNum]), ERRORS.ensureIsNumber(argNum));
    }

    ensureIsOwner() {
        return super.apply(this.command.message.author.id === '116690352584392704', 'This command is owner-only.');
    }
}

Object.assign(Validate, ERRORS);

module.exports = Validate;
