/**
 * Created by Will on 12/6/2016.
 */

const voiceConnectionOperator = require('../operators/voiceConnection');
const commandOperator = require('../operators/command');

function guildMemberSpeaking(member, speaking)  {
    if(member.listen && speaking)   {

        const msg = member.listen;
        member.listen = false;

        member.voiceChannel.join().then(conn => {
            return voiceConnectionOperator.speechToText(conn.createReceiver().createPCMStream(member))
        }).then(text => {
            if(msg.constructor.name == 'Message')    {
                msg.channel.sendMessage('`' + text + '`');

                const cmd = commandOperator(msg.client, msg, text.toLowerCase());
                if(cmd) {
                    cmd.call();
                }
            }
        }).catch(console.error);
    }
}

module.exports = guildMemberSpeaking;