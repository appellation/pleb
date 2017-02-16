/**
 * Created by Will on 2/3/2017.
 */

const ERRORS = {
    ensureGuild: 'This command cannot be run outside of a guild.',
    ensureClientPermissions: perm => `Cannot ${perm.split('_').join(' ').toLowerCase()}.`,
    ensureArgs: 'No command arguments were provided.',
    ensureReplyable: 'Cannot send messages in that channel.',
    ensureMemberVoice: 'Author is not in a voice channel.',
    ensureJoinable: 'Cannot join author\'s voice channel.',
    ensureSpeakable: 'Cannot speak in author\'s voice channel.',
    ensureCurrentVoiceChannel: 'Not currently connected to a voice channel.',
    ensurePlaylist: 'No playlist available.',
    ensureNSFW: 'NSFW is not allowed.',
    ensureIsNumber: argNum => `Argument ${argNum + 1} must be a number.`
};

const playlistStorage = require('../storage/playlists');
const {ValidationProcessor} = require('discord-handles');

class Validate extends ValidationProcessor {

    /**
     * Ensure the message is in a guild.
     * @return {*}
     */
    ensureGuild() {
        return this.applyValid(this.message.channel.type === 'text', ERRORS.ensureGuild);
    }

    /**
     * Ensure that the client has a permission resolvable.
     * @param resolvable
     * @return {boolean}
     */
    ensureClientPermissions(resolvable) {
        if(this.message.channel.type === 'dm') return this.applyValid(true);

        return this.ensureGuild() && this.applyValid(this.message.channel.permissionsFor(this.message.guild.member(this.message.client.user)).hasPermission(resolvable), ERRORS.ensureClientPermissions(resolvable));
    }

    ensurePlaylist()    {
        return this.ensureGuild() && (this.applyValid(playlistStorage.has(this.message.guild.id), ERRORS.ensurePlaylist) && this.ensureCurrentVoiceChannel());
    }

    /**
     * Ensure that some arguments exist.
     * @return {boolean}
     */
    ensureArgs() {
        return this.applyValid(this.command.args.length > 0, ERRORS.ensureArgs);
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
        return this.ensureGuild() && this.applyValid(this.message.member.voiceChannel, ERRORS.ensureMemberVoice);
    }

    /**
     * Ensure that the client can join the author's voice channel.
     * @return {boolean}
     */
    ensureJoinable() {
        return this.ensureMemberVoice() && this.applyValid(this.message.member.voiceChannel.joinable, ERRORS.ensureJoinable);
    }

    /**
     * Ensure that the client can speak in the author's voice channel.
     * @return {boolean}
     */
    ensureSpeakable() {
        return this.ensureMemberVoice() && this.applyValid(this.message.member.voiceChannel.speakable, ERRORS.ensureSpeakable);
    }

    ensureNSFW() {
        return this.applyValid(!!(this.message.channel.type === 'dm' || this.message.member.roles.find(role => role.name.toLowerCase() === 'nsfw') || this.message.channel.name.toLowerCase() === 'nsfw'), ERRORS.ensureNSFW);
    }

    ensureCanPlay() {
        return this.ensurePlaylist() || (this.ensureJoinable() && this.ensureSpeakable());
    }

    /**
     * Ensure that the client is currently connected to a voice channel.
     * @return {boolean}
     */
    ensureCurrentVoiceChannel() {
        return this.ensureGuild() && this.applyValid(this.message.client.voiceConnections.has(this.message.guild.id), ERRORS.ensureCurrentVoiceChannel);
    }

    ensureIsNumber(argNum) {
        return this.applyValid(!isNaN(this.command.args[argNum]), ERRORS.ensureIsNumber(argNum));
    }
}

Object.assign(Validate, ERRORS);

module.exports = Validate;