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
 */
function Play (client, msg, args) {
    /**
     * Promise that resolves with the list of YouTube video IDs
     * @var {Promise} list
     */
    var list;

    // if no valid URL provided, search using other params
    if(!validUrl.is_web_uri(args[0]))   {
        const q = args.join(' ');

        // fetch first search result from YouTube
        list = new Promise(function(resolve, reject) {
            ytApi.addParam('type', 'video');
            ytApi.search(q, 1, function(err, result)   {
                if(err)   {
                    reject(err);
                    console.error(err);
                }   else    {
                    const ytUrl = 'https://www.youtube.com/watch?v=' + result.items[0].id.videoId;
                    client.reply(msg, 'now playing: ' + ytUrl);
                    resolve([ytUrl]);
                }
            });
        });

        // if a valid URL is provided
    }   else    {
        list = new Promise(function(resolve, reject) {
            if(!args[0]) {
                reject('Nothing to play.');
            }

            // parse URL
            const parsed = URL.parse(args[0], true);

            // make sure it's a YouTube URL
            const mainYTUrl = parsed.host === 'www.youtube.com' || parsed.host === 'youtube.com';
            if(!mainYTUrl && parsed.host !== 'youtu.be') {
                reject('That\'s not a YouTube link.');
            }

            // if it's a single YouTube video
            if(parsed.pathname === '/watch' && parsed.query.v && mainYTUrl)   {
                resolve([args[0]]);

                // if it's a YouTube playlist
            }   else if(parsed.pathname === '/playlist' && parsed.query.list && mainYTUrl)   {

                const urls = [];

                /**
                 * Pushes video IDs into urls array, then resolves the Promise
                 */
                function pushUrls()  {
                    ytApi.getPlayListsItemsById(parsed.query.list, function(err, result) {
                        ytApi.addParam('maxResults', '50');
                        ytApi.addParam('part', 'contentDetails');

                        if(err) {
                            console.error(err);
                            reject('Cannot retrieve playlist information.');
                        }

                        // iterate over PlaylistItems array
                        _.each(result.items, function(element, index, list) {
                            urls.push(element.contentDetails.videoId)
                        });

                        // if there's another page, fetch it
                        if(result.nextPageToken)    {
                            ytApi.addParam('pageToken', result.nextPageToken);
                            pushUrls();

                            // otherwise, resolve
                        }   else    {
                            resolve(urls);
                        }
                    });
                }

                pushUrls();

                // if it's the short YouTube URL
            }   else if(!mainYTUrl) {
                resolve([parsed.pathname.replace(/(^\/)/, '')]);

                // otherwise, we have no idea what to do
            }   else    {
                reject('That URL doesn\'t make sense.');
            }
        });
    }

    // get voice channels
    const userVoice = msg.author.voiceChannel;
    const botVoice = client.voiceConnections.get('server', msg.server);

    // consolidate voice channels based on bot and user status
    var voice;
    // if neither bot nor user are connected
    if(userVoice === null && botVoice === null)    {
        client.reply(msg, 'I can\'t join a find a voice channel to join, since neither you nor me are in one.');
        return;

        // if the bot isn't connected
    }   else if(botVoice === null)  {
        voice = client.joinVoiceChannel(userVoice);

        // if the bot is connected
    }   else    {
        voice = botVoice;
    }

    // do things like play music
    Promise.all([list, voice]).then(function(resolutions)    {

        /**
         * Get the resolved VoiceConnection.
         * @type {VoiceConnection}
         */
        var vc = resolutions[1];

        /**
         * Get the resolved list of YouTube IDs
         * @type {[]}
         */
        var list = resolutions[0];

        // notify of playing
        console.log('Playing in \'' + vc.voiceChannel.name + '\' voice channel on \'' + vc.server.name + '\'.');

        /**
         * Keep playing music in the list if more exists
         * @param list
         * @param pos
         */
        function playList(list, pos) {
            var stream;
            try {
                stream = ytStream(list[pos]);
            }   catch(e)    {
                console.error('Stream initialization error - ' + e);
                return;
            }

            stream.on('error', function(e)  {
                console.error('stream error' + e);
            }).on('close', function()  {
                if(pos + 1 < list.length) {
                    playList(list, pos + 1);
                }
                console.log('stream closed');
            });

            const vcStream = vc.playRawStream(stream);
            if(pos + 1 < list.length)   {
                client.sendMessage(msg.channel, 'now playing ' + (pos + 1) + ' of ' + list.length);
            }
            return vcStream;
        }

        return playList(list, 0);

    }).catch(function(err)  {
        client.reply(msg, err);
        console.error(err);
    })
}

module.exports = Play;