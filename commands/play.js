/**
 * Created by Will on 8/25/2016.
 */
const ytStream = require('youtube-audio-stream');
const ytNode = require('youtube-node');
const validUrl = require('valid-url');
const URL = require('url');
const _ = require('underscore');

const ytApi = new ytNode();
ytApi.setKey(process.env.youtube);

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @constructor
 */
function Play (client, msg, args) {
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
            const ee = yt.start();
            ee.on('start', function(list)   {
                if(!list.hasNext() && list.length() === 1)  {
                    msg.reply('now playing ' + yt.getList().getCurrent().get().url);
                }
            });

            ee.on('start', function(list)    {
                if(list.length() > 1)  {
                    msg.channel.sendMessage('now playing ' + (list.pos() + 1) + ' of ' + list.length() + ': ' + list.getCurrent().get().name);
                }
            })

        }).catch(function(err)  {
            console.error(err);
        });
    }).catch(function(err)  {
        console.error(err);
    });
}

module.exports = Play;