/**
 * Created by Will on 9/7/2016.
 */

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
         * Check voice connections in a given guild.  Prioritizes existing connections over the author connection.
         * @param {Client} client
         * @param {Message} msg
         * @returns {Promise} - Resolves with the preferred voice connection.
         */
        static checkCurrent(client, msg) {
            return new Promise(function(resolve, reject)    {

                const clientVC = client.voiceConnections.get(msg.guild.id);
                const authorChannel = msg.member.voiceChannel;

                if(!clientVC) {
                    if(authorChannel) {
                        authorChannel.join().then(resolve);
                    }   else    {
                        reject('No voice channel to join.');
                    }
                }   else    {
                    resolve(clientVC);
                }
            });

        }
    }

    module.exports = VC;
}());