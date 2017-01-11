/**
 * Created by Will on 8/31/2016.
 */

const StreamStructure = require('../structures/stream');
const PlaylistStructure = require('../structures/playlist');

const URL = require('url');
const validUrl = require('valid-url');
const rp = require('request-promise-native');

const idRegex = /[a-zA-Z0-9-_]+$/;

/**
 * Create a YouTube interface with a PlaylistStructure.
 */
class YTPlaylist   {

    /**
     * Constructor.
     * @param {PlaylistStructure} [list] - A playlist structure to interact with.
     * @constructor
     */
    constructor(list) {
        this.list = list || new PlaylistStructure();
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
                return Promise.reject();
            }
        }   else   {
            return this.addQuery(dataIn.join(' '));
        }
    }

    /**
     * Add a YouTube playlist to the playlist.
     * @param {String} playlistUrl
     * @returns {Promise} - A promise that resolves when the playlist is finished getting added.
     */
    addPlaylist(playlistUrl)    {
        if(!YTPlaylist.isYouTubeURL(playlistUrl) || YTPlaylist.getURLType(playlistUrl) !== 'playlist') return Promise.reject('Not a YouTube playlist.');
        return this._addPlaylistPage(URL.parse(playlistUrl, true).query.list);
    }

    /**
     * Add a playlist by query.
     *
     * @param {String} query
     * @return {Promise}
     */
    addPlaylistQuery(query)    {
        if(!query) throw new Error('no query provided');
        return rp.get({
            url: 'https://www.googleapis.com/youtube/v3/search',
            qs: {
                q: query,
                type: 'playlist',
                part: 'id',
                key: process.env.youtube
            },
            json: true
        }).then(res => {
            if(res.items.length === 0) return Promise.reject('no playlist for that query');
            return this._addPlaylistPage(res.items[0].id.playlistId);
        });
    }

    /**
     * Recursively add a playlist.
     *
     * @param playlistID
     * @param [pageToken]
     * @return {Promise}
     * @private
     */
    _addPlaylistPage(playlistID, pageToken) {
        const options = {
            uri: 'https://www.googleapis.com/youtube/v3/playlistItems',
            qs: {
                part: 'contentDetails,snippet,status',
                playlistId: playlistID,
                maxResults: 50,
                key: process.env.youtube
            },
            json: true
        };

        if(pageToken) options.qs.pageToken = pageToken;

        return rp.get(options).then(result => {
            for(const elem of result.items) {
                if(elem.status.privacyStatus !== 'public' && elem.status.privacyStatus !== 'unlisted') continue;
                this.list.add(new StreamStructure('https://www.youtube.com/watch?v=' + elem.contentDetails.videoId, elem.snippet.title));
            }

            if(result.nextPageToken) return this._addPlaylistPage(playlistID, result.nextPageToken);
            return this.list;
        });
    }

    /**
     * Add a YouTube video to the playlist.
     * @param {String} videoUrl
     * @returns {Promise}
     */
    addVideo(videoUrl)  {
        const videoType = YTPlaylist.getURLType(videoUrl);

        if(!YTPlaylist.isYouTubeURL(videoUrl) || (videoType !== 'short video' && videoType !== 'long video')) return Promise.reject('Not a valid YouTube video URL.');

        return rp.get({
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
                this.list.add(new StreamStructure('https://www.youtube.com/watch?v=' + item.id, item.snippet.title));
                return this.list;
            }   else {
                return Promise.reject('can\'t play live streams :cry:');
            }
        }).catch(() => Promise.reject('Couldn\'t retrieve video information.'));
    }

    /**
     * Add a YouTube search query to the playlist.
     * @param {String} query
     * @returns {Promise}
     */
    addQuery(query) {
        if(!query) throw new Error('no query provided.');
        return rp.get({
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
                if(item.snippet.liveBroadcastContent !== 'none') continue;
                this.list.add(new StreamStructure('https://www.youtube.com/watch?v=' + item.id.videoId, item.snippet.title));
                return this.list;
            }

            return Promise.reject('Couldn\'t find a video for that query.');
        });
    }


    // STATIC

    /**
     * Get the ID of the supplied URL based on its type.
     * @param {String} testUrl
     * @returns {String|null}
     * @static
     */
    static getURLID (testUrl) {
        if(!this.isYouTubeURL(testUrl)) return null;

        const parsed = URL.parse(testUrl, true);
        const type = this.getURLType(testUrl);
        switch (type)   { /* eslint-disable indent */
            case 'short video': return parsed.pathname.substring(1);
            case 'long video': return parsed.query.v;
            case 'playlist': return parsed.query.list;
        } /* eslint-enable indent */

        return null;
    }

    /**
     * Returns whether a given URL is a video.
     * @param {String} testURL
     * @returns {boolean}
     */
    static isVideo(testURL) {
        return YTPlaylist.getURLType(testURL) === 'long video' || YTPlaylist.getURLType(testURL) === 'short video';
    }

    /**
     * Get the type of the link.
     * @param {String} testUrl - URL to be tested.
     * @returns {String|null}
     * @static
     */
    static getURLType(testUrl) {
        if(!YTPlaylist.isYouTubeURL(testUrl)) return null;

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

        return null;
    }

    /**
     * Determines if a provided URL is a valid YouTube link (either playlist or video)
     * @param {String} ytUrl
     * @returns {boolean}
     * @static
     */
    static isYouTubeURL(ytUrl)   {
        if(!validUrl.is_web_uri(ytUrl)) return false;

        const parsed = URL.parse(ytUrl, true);
        if(parsed.host === 'www.youtube.com' || parsed.host === 'youtube.com')  {
            if(parsed.pathname === '/watch')    {
                if(!parsed.query.v) return false;
                return parsed.query.v.match(idRegex) !== null;

            }   else if(parsed.pathname === '/playlist')    {
                if(!parsed.query.list) return false;
                return parsed.query.list.match(idRegex) !== null;
            }
        }   else if(parsed.host === 'youtu.be') {
            return parsed.pathname.substring(1).match(idRegex) !== null;
        }

        return false;
    }
}

module.exports = YTPlaylist;
