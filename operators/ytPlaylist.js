/**
 * Created by Will on 8/27/2016.
 */

"use strict";

const Playlist = require('../structures/playlist');
const Stream = require('../structures/stream');

const url = require('url');
const validUrl = require('valid-url');
const ytStream = require('youtube-audio-stream');
const ytNode = require('youtube-node');
const _ = require('underscore');
const EventEmitter = require('events');

const ee = new EventEmitter();

const ytApi = new ytNode();
ytApi.setKey(process.env.youtube);

/**
 * Operate a playlist with YouTube.
 * @param {VoiceConnection} vc
 * @constructor
 */
function YTPlaylist(vc) {

    // CONSTRUCTOR

    if(!vc) {
        throw new Error('No voice connection.');
    }

    // PROPERTIES

    /**
     * Immediately define self.
     * @type {YTPlaylist}
     */
    const self = this;

    /**
     * Regular expression for evaluating video and playlist IDs.
     * @type {RegExp}
     */
    const idRegex = /[a-zA-Z0-9-_]+$/;

    /**
     * @type {Playlist}
     */
    let list = new Playlist();



    // PUBLIC FUNCTIONS

    /**
     * Start the playlist.
     * @returns {EventEmitter} Possible `start`, `next`, `end`.
     */
    this.start = function() {
        if(list.hasCurrent())    {
            return play();
        }
    };

    /**
     * Advance the playlist.
     * @returns {Stream} Next song.
     */
    this.next = function()  {
        if(list.hasNext())  {
            list.next();
            return list.getCurrent();
        }
    };

    /**
     * Stop playback.
     */
    this.stop = function() {
        if(vc.playing) {
            vc.stopPlaying();
        }
    };

    /**
     * Destroy the audio connection.
     */
    this.destroy = function()   {
        vc.destroy();
        ee.emit('destroyed');
        vc = null;
    };

    /**
     * Pause playback.
     */
    this.pause = function()    {
        if(vc.playing && !vc.paused)  {
            vc.pause();
        }
    };

    /**
     * Resume playback.
     */
    this.resume = function() {
        if(vc.playing && vc.paused)  {
            vc.resume();
        }
    };

    /**
     * Shuffle the playlist.
     */
    this.shuffle = function()   {
        self.stop();
        list.shuffle();
        self.start();
    };

    /**
     * Get the current song.
     * @returns {Playlist}
     */
    this.getList = function()    {
        return list;
    };

    /**
     * Get the EventEmitter: `start`, `next`, `end`.
     * @returns {EventEmitter}
     */
    this.getEvents = function() {
        return ee;
    };

    /**
     * Add command arguments to the playlist.
     * @param {Array} dataIn - Command arguments
     * @returns {Promise} Resolved when the arguments have been added.
     */
    this.addArgs = function(dataIn)   {
        if(self.isYouTubeURL(dataIn[0]))   {
            const url = dataIn[0];
            const urlType = self.getURLType(url);

            if(urlType === 'playlist')  {
                return self.addPlaylist(url);
            }   else if(urlType === 'long video' || urlType === 'short video')  {
                return self.addVideo(url);
            }   else    {
                return new Promise(function(resolve, reject)    {
                    reject();
                });
            }
        }   else   {
            return self.addQuery(dataIn.join(' '));
        }
    };

    /**
     * Add a YouTube playlist to the playlist.
     * @param {string} playlistUrl
     * @returns {Promise} - A promise that resolves when the playlist is finished getting added.
     */
    this.addPlaylist = function(playlistUrl)    {


        ytApi.addParam('maxResults', '50');
        ytApi.addParam('part', 'contentDetails,snippet');

        return new Promise(function(resolve, reject)    {

            if(!self.isYouTubeURL(playlistUrl) || self.getURLType(playlistUrl) !== 'playlist') {
                reject('Not a YouTube playlist.');
            }

            /**
             * Recursively retrieve videos from a playlist.
             * @param {string} [pageToken]
             */
            function recurse(pageToken)  {
                pageToken = pageToken || null;

                if(pageToken)    {
                    ytApi.addParam('pageToken', pageToken);
                }

                ytApi.getPlayListsItemsById(url.parse(playlistUrl, true).query.list, function(err, result)  {
                    if(err) {
                        reject(new Error('Error retrieving playlist details.  ' + err));
                        return;
                    }

                    _.each(result.items, function(elem) {
                        list.add(new Stream('https://www.youtube.com/watch?v=' + elem.contentDetails.videoId, elem.snippet.title));
                    });

                    if(result.nextPageToken)    {
                        recurse(result.nextPageToken);
                    }   else    {
                        resolve(list);
                    }
                });
            }

            recurse();
        })
    };

    /**
     * Add a YouTube video to the playlist.
     * @param {string} videoUrl
     * @returns {Promise}
     */
    this.addVideo = function(videoUrl)  {
        const videoType = self.getURLType(videoUrl);

        return new Promise(function(resolve, reject)    {
            if(!self.isYouTubeURL(videoUrl) || (videoType !== 'short video' && videoType !== 'long video'))   {
                reject('Not a valid YouTube video URL.');
            }

            ytApi.addParam('part', 'snippet,id');
            ytApi.getById(self.getURLID(videoUrl), function(err, result)    {
                if(err) {
                    reject('Couldn\'t retrieve video information.');
                }

                list.add(new Stream('https://wwww.youtube.com/watch?v=' + result.items[0].id, result.items[0].snippet.title));
                resolve(list);
            });
        })
    };

    /**
     * Add a YouTube search query to the playlist.
     * @param {string} query
     * @returns {Promise}
     */
    this.addQuery = function(query) {
        ytApi.addParam('type', 'video');
        ytApi.addParam('part', 'id,snippet');

        return new Promise(function(resolve, reject)    {
            if(!query)  {
                reject();
            }

            ytApi.search(query, 1, function(err, result)   {
                if(err)   {
                    reject(err);
                    console.error(err);
                }   else    {
                    list.add(new Stream('https://www.youtube.com/watch?v=' + result.items[0].id.videoId, result.items[0].snippet.title));
                    resolve(list);
                }
            });
        });
    };

    /**
     * Get the ID of the supplied URL based on its type.
     * @param {string} testUrl
     * @returns {boolean|string}
     */
    this.getURLID = function (testUrl) {
        if(!self.isYouTubeURL(testUrl)) {
            return false;
        }

        const parsed = url.parse(testUrl, true);
        if(self.getURLType(testUrl) ===  'short video') {
            return parsed.pathname.substring(1);
        }   else if(self.getURLType(testUrl) === 'long video')  {
            return parsed.query.v;
        }   else if(self.getURLType(testUrl) === 'playlist')    {
            return parsed.query.list;
        }

        return false;
    };

    /**
     * Get the type of the link.
     * @param {string} testUrl - URL to be tested.
     * @returns {boolean|string}
     */
    this.getURLType = function(testUrl) {
        if(!self.isYouTubeURL(testUrl)) {
            return false;
        }

        const parsed = url.parse(testUrl, true);
        if(parsed.host === 'www.youtube.com' || parsed.host == 'youtube.com')   {
            if(parsed.pathname === '/watch' && parsed.query.v && parsed.query.v.match(idRegex) !== null) {
                return 'long video';
            }   else if(parsed.pathname === '/playlist' && parsed.query.list && parsed.query.list.match(idRegex) !== null)   {
                return 'playlist';
            }
        }   else if(parsed.host === 'youtu.be' && parsed.pathname.match(idRegex) !== null) {
            return 'short video';
        }

        return false;
    };

    /**
     * Determines if a provided URL is a valid YouTube link (either playlist or video)
     * @param {string} ytUrl
     * @returns {boolean}
     */
    this.isYouTubeURL = function(ytUrl)   {
        if(!validUrl.is_web_uri(ytUrl)) {
            return false;
        }

        const parsed = url.parse(ytUrl, true);

        if(parsed.host === 'www.youtube.com' || parsed.host === 'youtube.com')  {
            if(parsed.pathname === '/watch')    {
                if(!parsed.query.v) {
                    return false;
                }

                return parsed.query.v.match(idRegex) !== null;

            }   else if(parsed.pathname === '/playlist')    {
                if(!parsed.query.list)  {
                    return false;
                }

                return parsed.query.list.match(idRegex) !== null;

            }
        }   else if(parsed.host === 'youtu.be') {
            return parsed.pathname.substring(1).match(idRegex) !== null;
        }

        return false;
    };

    /**
     * Determines if a provided URL has a valid YouTube playlist.
     * @param {string} ytUrl
     * @returns {boolean}
     */
    this.hasPlaylist = function(ytUrl)   {
        if(!this.isYouTubeURL(ytUrl))   {
            return false;
        }

        const list = url.parse(ytUrl, true).query.list;
        return (list && list.match(idRegex) !== null);
    };


    // PRIVATE FUNCTIONS

    /**
     * Play the playlist.
     * @returns {EventEmitter}
     */
    function play()   {

        if(!list.hasCurrent())  {
            ee.emit('error');
        }

        if(vc.playing)  {
            self.stop();
        }

        const stream = vc.playRawStream(ytStream(list.getCurrent().get().url));

        stream.then(function(intent)   {
            ee.emit('start', list);

            /**
             * Resolves on stream end, if not destroyed.
             */
            return new Promise(function(resolve, reject)   {
                var destroyed = false;
                ee.on('destroy', function() {
                    destroyed = true;
                    reject();
                });
                if(destroyed)   {
                    return;
                }

                intent.once('end', function()   {
                    resolve();
                })
            });
        }).then(function()   {
            if(list.hasNext())  {
                list.next();
                ee.emit('next', list);
                play();
            }   else    {
                ee.emit('end');
            }
        }).catch(function (err) {
            ee.emit('error', err);
            console.error(err);
        });

        return ee;
    }
}

module.exports = YTPlaylist;