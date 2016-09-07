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
    const YT = require('../interfaces/yt');
    const PlaylistStructure = require('../structures/playlist');

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
        var yt;

        if(msg.server.ytPlaylist)   {
            yt = msg.server.ytPlaylist;
            yt.list = new PlaylistStructure();
        }   else    {
            yt = new YT(conn);
            msg.server.ytPlaylist = yt;
        }

        yt.add(args).then(function(list) {
            yt.start();
            yt.ee.on('end', function()  {
                msg.reply('song ended');
            })
        }).catch(function(err)  {
            console.error(new Error(err));
        });
    }).catch(function(err)  {
        console.error(new Error(err));
    });
}

module.exports = Test;