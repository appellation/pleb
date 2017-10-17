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
  ensureIsNumber: key => `Argument ${key} must be a number.`
};

class Validate {
  get message() {
    return this.command.message;
  }

  get guild() {
    return this.command.guild;
  }

  get channel() {
    return this.message.channel;
  }

  /**
   * Ensure the message is in a guild.
   * @return {*}
   */
  ensureGuild() {
    return this.apply(() => this.channel.type === 'text', ERRORS.ensureGuild);
  }

  /**
   * Ensure that the client has a permission resolvable.
   * @param resolvable
   * @return {boolean}
   */
  ensureClientPermissions(resolvable) {
    if (this.channel.type === 'dm') return this.apply(true);
    this.ensureGuild();
    return this.apply(() => this.channel.permissionsFor(this.guild.me).has(resolvable), ERRORS.ensureClientPermissions(resolvable));
  }

  ensurePlaylist() {
    this.ensureGuild();
    return this.apply(() => this.guild.playlist, ERRORS.ensurePlaylist) && this.ensureCurrentVoiceChannel();
  }

  /**
   * Ensure that some arguments exist.
   * @return {boolean}
   */
  ensureArgs() {
    return this.apply(() => this.command.args && Object.keys(this.command.args).length > 0, ERRORS.ensureArgs);
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
    this.ensureGuild();
    return this.apply(() => this.message.member.voiceChannel, ERRORS.ensureMemberVoice);
  }

  /**
   * Ensure that the client can join the author's voice channel.
   * @return {boolean}
   */
  ensureJoinable() {
    return this.apply(() => this.message.member.voiceChannel.joinable, ERRORS.ensureJoinable);
  }

  /**
   * Ensure that the client can speak in the author's voice channel.
   * @return {boolean}
   */
  ensureSpeakable() {
    this.ensureMemberVoice();
    return this.apply(() => this.message.member.voiceChannel.speakable, ERRORS.ensureSpeakable);
  }

  ensureNSFW() {
    return this.apply(() => this.channel.nsfw, ERRORS.ensureNSFW);
  }

  ensureCanPlay() {
    this.ensureJoinable();
    return this.ensureSpeakable();
  }

  /**
   * Ensure that the client is currently connected to a voice channel.
   * @return {boolean}
   */
  ensureCurrentVoiceChannel() {
    this.ensureGuild();
    return this.apply(() => this.command.client.voiceConnections.has(this.guild.id), ERRORS.ensureCurrentVoiceChannel);
  }

  ensureIsNumber(key) {
    return this.apply(() => !isNaN(this.command.args[key]), ERRORS.ensureIsNumber(key));
  }

  ensureIsOwner() {
    return this.apply(() => this.message.author.id === '116690352584392704', 'This command is owner-only.');
  }
}

for (const prop of Object.getOwnPropertyNames(Validate.prototype))
  Object.defineProperty(Validator.prototype, prop, Object.getOwnPropertyDescriptor(Validate.prototype, prop));
