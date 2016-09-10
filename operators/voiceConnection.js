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

                const clientVC = client.voiceConnections.filter(function(/*VoiceConnection*/elem) {
                    return elem.channel.guild === msg.guild;
                }).first();

                const authorChannel = msg.guild.channels.filter(function (/*VoiceChannel*/elem)  {
                    return elem.type === 'voice' && elem.members.find('id', msg.author.id);
                }).first();

                if(!clientVC) {
                    if(authorChannel) {
                        authorChannel.join().then(function(conn) {
                            resolve(conn);
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