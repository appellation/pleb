/**
 * Created by Will on 8/28/2016.
 */

/**
 * Test command.
 * @param {Client} client
 * @param {Message} msg
 * @param {Array} args
 * @constructor
 */
function Test(client, msg, args)    {
    const YTPlaylist = require('../operators/ytPlaylist');

    const vc = new Promise(function(resolve, reject)    {

        if(!vc) {
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
            resolve(client.voiceConnections.get('server', msg.server));
        }
    });

    vc.then(function(conn)  {
        const yt = new YTPlaylist(conn);
        msg.server.ytPlaylist = yt;

        yt.addArgs(args).then(function(list) {
            yt.start();
        }).catch(function(err)  {
            console.error(err);
        });
    }).catch(function(err)  {
        console.error(err);
    });
}

module.exports = Test;