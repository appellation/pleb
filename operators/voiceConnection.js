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
         * Check the voice connections available for a given message.
         * @param {Client} client
         * @param {Message} msg
         * @returns {Promise} - Resolves with the preferred voice connection.
         */
        static check(client, msg) {
            return new Promise(function(resolve, reject)    {

                const clientVC = client.voiceConnections.get('server', msg.server);

                if(!clientVC) {
                    if(msg.author.voiceChannel) {
                        client.joinVoiceChannel(msg.author.voiceChannel, function(err, conn)    {
                            if(err) {
                                reject(err);
                            }   else    {
                                resolve(conn);
                            }
                        });
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