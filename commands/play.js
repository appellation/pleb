/**
 * Created by Will on 8/25/2016.
 */
const ytStream = require('youtube-audio-stream');
const ytNode = require('youtube-node');
const validUrl = require('valid-url');
const URL = require('url');

const ytApi = new ytNode();
ytApi.setKey('AIzaSyAVec5Cy-lhs07uAywh6bmo0_I9YeuvNVM');
ytApi.addParam('type', 'video');

/*
SC.initialize({
    client_id: 'b7fac2455a584417547c08d59ca97cdc'
});
*/

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 */
function Play (client, msg, args) {
    var url;

    if(!validUrl.is_web_uri(args[0]))   {
        const q = args.join(' ');
        url = new Promise(function(resolve, reject) {
            ytApi.search(q, 1, function(err, result)   {
                if(err)   {
                    reject(err);
                    console.error(err);
                }   else    {
                    resolve('https://www.youtube.com/watch?v=' + result.items[0].id.videoId);
                }
            });
        });
    }   else    {
        url = new Promise(function(resolve, reject) {
            if(args[0]) {
                resolve(args[0]);
            }   else    {
                reject('Nothing to play.');
            }
        });
    }

    const userVoice = msg.author.voiceChannel;
    const botVoice = client.voiceConnections.get('server', msg.server);

    var voice;

    if(userVoice === null && botVoice === null)    {
        client.reply(msg, 'I can\'t join a find a voice channel to join, since neither you nor me are in one.');
        return;
    }   else if(botVoice === null)  {
        voice = client.joinVoiceChannel(userVoice);
    }   else    {
        voice = botVoice;
    }

    // do things like play music
    Promise.all([url, voice]).then(function(resolutions)    {

        var vc = resolutions[1];
        var url = resolutions[0];

        console.log('Playing in \'' + vc.voiceChannel.name + '\' voice channel on \'' + vc.server.name + '\'.');

        var stream;
        try {
            stream = ytStream(url);
        }   catch(e)    {
            console.error('try...catch stream error ' + e);
            return;
        }

        stream.on('error', function(e)  {
            console.error('stream error' + e);
        }).on('close', function()  {
            console.log('stream closed');
        });

        return vc.playRawStream(stream);
    }).catch(function(err)  {
        console.error(err);
    })
}

module.exports = Play;