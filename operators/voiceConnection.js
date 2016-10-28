/**
 * Created by Will on 9/7/2016.
 */

 const speech = require('@google-cloud/speech')({
    projectId: process.env.google_cloud_project_id,
    credentials: {
        client_email: process.env.google_cloud_email,
        private_key: process.env.google_cloud_private_key
    }
});

const ffmpeg = require('fluent-ffmpeg');

(function() {
    class VC   {

        /**
         * @constructor
         * @param {VoiceConnection} vc
         */
        constructor(vc) {
            this.vc = vc;
        }

        /**
         * Convert speech to text for a given member
         * @param {ReadableStream} stream
         * @returns {Promise}
         */
        static speechToText(stream)  {
            const out = speech.createRecognizeStream({
                config: {
                    encoding: 'LINEAR16',
                    sampleRate: 16000
                },
                singleUtterance: true,
                interimResults: false
            });

            return new Promise((resolve, reject) => {
                ffmpeg(stream)
                    .inputFormat('s32le')
                    .audioFrequency(16000)
                    .audioChannels(1)
                    .audioCodec('pcm_s16le')
                    .format('s16le')
                    .on('error', reject)
                    .pipe(out)
                    .on('error', reject)
                    .on('data', res => {
                        if(res.endpointerType == speech.endpointerTypes.ENDPOINTER_EVENT_UNSPECIFIED) {
                            resolve(res.results);
                        }
                    });
            });
        }

        /**
         * Check if author is in a voice channel and connect if so.
         * @param {Message} msg
         * @returns {Promise}
         */
        static checkUser(msg)   {
            return new Promise((resolve, reject) => {
                const authorChannel = msg.member.voiceChannel;

                if(authorChannel) {
                    authorChannel.join().then(resolve);
                }   else    {
                    reject('No voice channel to join.');
                }
            });
        }

        /**
         * Check voice connections in a given guild.  Prioritizes existing connections over the author connection.
         * @param {Client} client
         * @param {Message} msg
         * @returns {Promise} - Resolves with the preferred voice connection.
         */
        static checkCurrent(client, msg) {
            return new Promise(resolve => {

                const clientVC = client.voiceConnections.get(msg.guild.id);

                if(!clientVC) {
                    resolve(VC.checkUser(msg));
                }   else    {
                    resolve(clientVC);
                }
            });
        }
    }

    module.exports = VC;
}());