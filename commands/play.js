/**
 * Created by Will on 8/25/2016.
 */

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @constructor
 */
function Play (client, msg, args) {
    const YTPlaylist = require('../operators/ytPlaylist');
    const Playlist = require('../structures/playlist');

    client.startTyping(msg.channel);

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

    var yt;
    vc.then(function(conn)  {

        if(msg.server.ytPlaylist)   {
            yt = msg.server.ytPlaylist;
            yt.setVC(conn);
        }   else    {
            yt = new YTPlaylist(conn);
            msg.server.ytPlaylist = yt;
        }

        yt.setList(new Playlist());

        return yt.addArgs(args);
    }).then(function(list)  {
        const ee = yt.start();
        ee.on('start', function(list)   {
            if(!list.hasNext() && list.length() === 1 && !yt.isYouTubeURL(args[0]))  {
                msg.reply('now playing ' + list.getCurrent().get().url);
            }

            if(list.length() > 1)  {
                msg.channel.sendMessage('now playing ' + (list.pos() + 1) + ' of ' + list.length() + ': ' + list.getCurrent().get().name);
            }

            client.stopTyping(msg.channel);
        });

    }).catch(function(err)  {
        console.error(err);
        msg.reply(err);
        client.stopTyping(msg.channel);
    });
}

module.exports = Play;