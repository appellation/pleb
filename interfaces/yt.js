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

            ytApi.addParam('maxResults', '50');
            ytApi.addParam('part', 'contentDetails,snippet');

            return new Promise(function(resolve, reject)    {

                if(!YTPlaylist.isYouTubeURL(playlistUrl) || YTPlaylist.getURLType(playlistUrl) !== 'playlist') {
                    reject('Not a YouTube playlist.');
                }

                /*
                 * Recursively retrieve videos from a playlist.
                 */
                function recurse(pageToken)  {
                    pageToken = pageToken || null;

                    delete ytApi.params.pageToken;
                    if(pageToken)    {
                        ytApi.addParam('pageToken', pageToken);
                    }

                    const options = {
                        uri: 'https://www.googleapis.com/youtube/v3/playlistItems',
                        qs: {
                            part: 'contentDetails,snippet',
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
                            self.list.add(new StreamStructure('https://www.youtube.com/watch?v=' + elem.contentDetails.videoId, elem.snippet.title));
                        });

                        if(result.nextPageToken)    {
                            recurse(result.nextPageToken);
                        }   else    {
                            resolve(self.list);
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

                ytApi.addParam('part', 'snippet,id');
                ytApi.getById(YTPlaylist.getURLID(videoUrl), function(err, result)    {
                    if(err) {
                        reject('Couldn\'t retrieve video information.');
                    }

                    self.list.add(new StreamStructure('https://www.youtube.com/watch?v=' + result.items[0].id, result.items[0].snippet.title));
                    resolve(self.list);
                });
            })
        };

        /**
         * Add a YouTube search query to the playlist.
         * @param {string} query
         * @returns {Promise}
         */
        addQuery(query) {
            ytApi.addParam('type', 'video');
            ytApi.addParam('part', 'id,snippet');

            const self = this;

            return new Promise(function(resolve, reject)    {
                if(!query)  {
                    reject();
                }

                ytApi.search(query, 1, function(err, result)   {
                    if(err)   {
                        reject(err);
                        console.error(err);
                    }   else if(result.items[0])    {
                        self.list.add(new StreamStructure('https://www.youtube.com/watch?v=' + result.items[0].id.videoId, result.items[0].snippet.title));
                        resolve(self.list);
                    }   else    {
                        reject('No video found.')
                    }
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
