/**
 * Created by Will on 9/7/2016.
 */

let speech;
if(process.env.google_cloud_project_id) {
    speech = require('@google-cloud/speech')({
        projectId: process.env.google_cloud_project_id,
        credentials: {
            client_email: process.env.google_cloud_email,
            private_key: process.env.google_cloud_private_key
        }
    });
}

const ffmpeg = require('fluent-ffmpeg');

class VC {

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
    static speechToText(stream) {
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
     * @param {GuildMember} member
     * @returns {Promise}
     */
    static checkUser(member) {
        const authorChannel = member.voiceChannel;
        if(authorChannel && authorChannel.joinable) {
            return authorChannel.join();
        } else {
            return Promise.reject('Unable to join voice channel.');
        }
    }

    /**
     * Check voice connections in a given guild.  Prioritizes existing connections over the author connection.
     * @param {Client} client
     * @param {GuildMember} member
     * @returns {Promise} - Resolves with the preferred voice connection.
     */
    static checkCurrent(client, member) {
        const clientVC = client.voiceConnections.get(member.guild.id);
        if(clientVC) {
            return Promise.resolve(clientVC);
        } else {
            return VC.checkUser(member);
        }
    }
}

module.exports = VC;