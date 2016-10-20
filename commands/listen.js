/**
 * Created by Will on 10/18/2016.
 */

const speech = require('@google-cloud/speech')({
    projectId: process.env.google_cloud_project_id,
    credentials: {
        client_email: process.env.google_cloud_email,
        private_key: process.env.google_cloud_private_key
    }
});
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const VC = require('../operators/voiceConnection');

function Listen(client, msg, args)  {
    return VC.checkCurrent(client, msg).then(conn => {
        return Promise.resolve(conn.createReceiver());
    }).then(receiver => {
        client.on('guildMemberSpeaking', listen);
        setTimeout(() => {
            client.removeListener('guildMemberSpeaking', listen);
            msg.reply('not listening anymore');
        }, 30000);

        function listen(member, speaking) {
            console.log(speaking);
            if(member.guild.id == msg.guild.id && speaking)   {
                const stream = receiver.createPCMStream(member);
                const out = speech.createRecognizeStream({
                    config: {
                        encoding: 'LINEAR16',
                        sampleRate: 16000
                    },
                    singleUtterance: true,
                    interimResults: true
                });

                ffmpeg(stream)
                    .inputFormat('s32le')
                    .audioFrequency(16000)
                    .audioChannels(1)
                    .audioCodec('pcm_s16le')
                    .format('s16le')
                    .on('error', console.error)
                    .pipe(out)
                    .on('error', console.error)
                    .on('data', res => {
                        console.log(res);
                        if(res.endpointerType == speech.endpointerTypes.ENDPOINTER_EVENT_UNSPECIFIED) {
                            msg.channel.sendMessage(res.results);
                        }
                    });
            }
        }
    });
}

module.exports = Listen;