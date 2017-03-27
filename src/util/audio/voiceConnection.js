/**
 * Created by Will on 9/7/2016.
 */

class VC {

    /**
     * @constructor
     * @param {VoiceConnection} vc
     */
    constructor(vc) {
        this.vc = vc;
    }

    /**
     * Check if author is in a voice channel and connect if so.
     * @param {GuildMember} member
     * @returns {Promise<VoiceConnection>}
     */
    static async checkUser(member) {
        const authorChannel = member.voiceChannel;
        if(authorChannel && authorChannel.joinable) return authorChannel.join();
        throw new Error('Unable to join voice channel.');
    }

    /**
     * Check voice connections in a given guild.  Prioritizes existing connections over the author connection.
     * @param {GuildMember} member
     * @returns {Promise<VoiceConnection>} - Resolves with the preferred voice connection.
     */
    static async checkCurrent(member) {
        const clientVC = member.client.voiceConnections.get(member.guild.id);
        if(clientVC) return clientVC;
        return VC.checkUser(member);
    }
}

module.exports = VC;