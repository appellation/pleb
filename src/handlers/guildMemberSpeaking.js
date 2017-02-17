/**
 * Created by Will on 12/6/2016.
 */

const voiceConnectionOperator = require('../util/audio/voiceConnection');
const commandOperator = require('./message');

function guildMemberSpeaking(member, speaking) {
    if(member.listen && speaking) {

        const msg = member.listen;
        member.listen = false;

        member.voiceChannel.join().then(conn => {
            return voiceConnectionOperator.speechToText(conn.createReceiver().createPCMStream(member));
        }).then(text => {
            if(msg.constructor.name == 'Message') {
                msg.channel.sendMessage('`' + text + '`');

                return commandOperator(msg, text.toLowerCase());
            }
        });
    }
}

module.exports = guildMemberSpeaking;