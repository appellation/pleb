/**
 * Created by Will on 8/31/2016.
 */

"use strict";

(function() {

    const StreamStructure = require('../structures/stream');

    const URL = require('url');
    const validUrl = require('valid-url');
    const ytNode = require('youtube-node');
    const rp = require('request-promise-native');
    const _ = require('underscore');

    const ytApi = new ytNode();
    ytApi.setKey(process.env.youtube);

    const idRegex = /[a-zA-Z0-9-_]+$/;

    /**
     * Create a YouTube interface with a PlaylistStructure.
     */
    class YTPlaylist   {

        /**
         * Constructor.
         * @param {PlaylistStructure} list - A playlist structure to interact with.
         * @constructor
         */
        constructor(list) {
            this.list = list;
        }

        /**
         * Add command arguments to the playlist.
         * @param {String[]} dataIn - An array of command arguments
         * @returns {Promise}
         */
        add(dataIn)  {
            if(YTPlaylist.isYouTubeURL(dataIn[0]))   {
                const url = dataIn[0];
                const urlType = YTPlaylist.getURLType(url);

                if(urlType === 'playlist')  {
                    return this.addPlaylist(url);
                }   else if(urlType === 'long video' || urlType === 'short video')  {
                    return this.addVideo(url);
                }   else    {
                    return new Promise(function(resolve, reject)    {
                        reject();
                    });
                }
            }   else   {
                return this.addQuery(dataIn.join(' '));
            }
        };

        /**
         * Add a YouTube playlist to the playlist.
         * @param {string} playlistUrl
         * @returns {Promise} - A promise that resolves when the playlist is finished getting added.
         */
        addPlaylist(playlistUrl)    {

            const self = this;

            return new Promise(function(resolve, reject)    {

                if(!YTPlaylist.isYouTubeURL(playlistUrl) || YTPlaylist.getURLType(playlistUrl) !== 'playlist') {
                    reject('Not a YouTube playlist.');
                }

                let first = true;
                /*
                 * Recursively retrieve videos from a playlist.
                 */
                function recurse(pageToken)  {
                    pageToken = pageToken || null;

                    const options = {
                        uri: 'https://www.googleapis.com/youtube/v3/playlistItems',
                        qs: {
                            part: 'contentDetails,snippet,status',
                            playlistId: URL.parse(playlistUrl, true).query.list,
                            maxResults: 50,
                            key: process.env.youtube
                        },
                        json: true
                    };

                    if(pageToken)   {
                        options.qs.pageToken = pageToken;
                    }

                    rp(options).then(function(result)  {

                        _.each(result.items, function(elem) {
                            if(elem.status.privacyStatus == 'public' || elem.status.privacyStatus == 'unlisted')    {
                                self.list.add(new StreamStructure('https://www.youtube.com/watch?v=' + elem.contentDetails.videoId, elem.snippet.title));

                                if(first)   {
                                    resolve(self.list);
                                    first = false;
                                }
                            }
                        });

                        if(result.nextPageToken)    {
                            recurse(result.nextPageToken);
                        }
                    }).catch(function(err)  {
                        reject(err);
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
        addVideo(videoUrl)  {
            const videoType = YTPlaylist.getURLType(videoUrl);
            const self = this;

            return new Promise(function(resolve, reject)    {
                if(!YTPlaylist.isYouTubeURL(videoUrl) || (videoType !== 'short video' && videoType !== 'long video'))   {
                    reject('Not a valid YouTube video URL.');
                }

                rp({
                    uri: 'https://www.googleapis.com/youtube/v3/videos',
                    qs: {
                        part: 'snippet,id,liveStreamingDetails',
                        id: YTPlaylist.getURLID(videoUrl),
                        maxResults: 1,
                        key: process.env.youtube
                    },
                    json: true
                }).then(res => {
                    const item = res.items[0];

                    if(typeof item.liveStreamingDetails == 'undefined') {
                        self.list.add(new StreamStructure('https://www.youtube.com/watch?v=' + item.id, item.snippet.title));
                        resolve(self.list);
                    }   else {
                        reject('can\'t play live streams :cry:');
                    }
                }).catch(err => {
                    reject('Couldn\'t retrieve video information.');
                });
            })
        };

        /**
         * Add a YouTube search query to the playlist.
         * @param {string} query
         * @returns {Promise}
         */
        addQuery(query) {
            const self = this;

            return new Promise(function(resolve, reject)    {
                if(!query)  {
                    reject();
                }

                rp({
                    uri: 'https://www.googleapis.com/youtube/v3/search',
                    qs: {
                        q: query,
                        type: 'video',
                        part: 'id,snippet',
                        key: process.env.youtube
                    },
                    json: true
                }).then(res => {
                    for(const item of res.items)    {
                        if(item.snippet.liveBroadcastContent == 'none') {
                            self.list.add(new StreamStructure('https://www.youtube.com/watch?v=' + item.id.videoId, item.snippet.title));
                            resolve(self.list);
                            return;
                        }
                    }

                    reject('Couldn\'t find a video for that query.');
                });
            });
        };


        // STATIC

        /**
         * Get the ID of the supplied URL based on its type.
         * @param {string} testUrl
         * @returns {boolean|string}
         * @static
         */
        static getURLID (testUrl) {
            if(!this.isYouTubeURL(testUrl)) {
                return false;
            }

            const parsed = URL.parse(testUrl, true);
            const type = this.getURLType(testUrl);
            if(type ===  'short video') {
                return parsed.pathname.substring(1);
            }   else if(type === 'long video')  {
                return parsed.query.v;
            }   else if(type === 'playlist')    {
                return parsed.query.list;
            }

            return false;
        };

        /**
         * Returns whether a given URL is a video.
         * @param {string} testURL
         * @returns {boolean}
         */
        static isVideo(testURL) {
            return YTPlaylist.getURLType(testURL) === 'long video' || YTPlaylist.getURLType(testURL) === 'short video';
        }

        /**
         * Get the type of the link.
         * @param {string} testUrl - URL to be tested.
         * @returns {boolean|string}
         * @static
         */
        static getURLType(testUrl) {
            if(!YTPlaylist.isYouTubeURL(testUrl)) {
                return false;
            }

            const parsed = URL.parse(testUrl, true);
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
         * @static
         */
        static isYouTubeURL(ytUrl)   {
            if(!validUrl.is_web_uri(ytUrl)) {
                return false;
            }

            const parsed = URL.parse(ytUrl, true);

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
    }

    module.exports = YTPlaylist;
})();
