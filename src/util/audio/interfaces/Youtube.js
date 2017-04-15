/**
 * Created by Will on 1/14/2017.
 */

const url = require('url');
const rp = require('request-promise-native').defaults({
    baseUrl: 'https://www.googleapis.com/youtube/v3',
    json: true,
    qs: {
        key: process.env.youtube
    }
});
const ytdl = require('ytdl-core');

const Soundcloud = require('./Soundcloud');
const Constants = {
    video: 'video',
    playlist: 'playlist',
    shortVideo: 'short video'
};

class Youtube {

    /**
     * Add command arguments to a playlists.  Automatically adds any non-url arguments and a query.
     * @param {Array} args
     * @return {Promise}
     */
    async add(args) {
        const urls = [];
        const query = args.filter(e => {
            if(Soundcloud.isViewURL(e)) return false;
            if(Youtube.isViewURL(e)) {
                urls.push(e);
                return false;
            }
            return true;
        }).join(' ');

        const loaded = [];

        if(query) loaded.push(await this.loadTrackQuery(query));
        for(const resource of urls) {
            try {
                const type = Youtube.getType(resource);
                const id = Youtube.parseID(resource);

                if(type === Constants.video || type === Constants.shortVideo) loaded.push(await this.loadTrack(id));
                else if(type === Constants.playlist) loaded.push(...(await this.loadPlaylist(id)));
            } catch (e) {
                // do nothing
            }
        }

        return loaded;
    }

    async loadTrackQuery(query = '') {
        const data = await rp({
            url: 'search',
            qs: {
                part: 'id,snippet',
                q: query,
                type: 'video',
                maxResults: 1
            }
        });
        if(!data.items.length) return null;
        return this._formatSong(data.items[0]);
    }

    async loadTrack(id = '') {
        const data = await rp({
            url: 'videos',
            qs: {
                part: 'id,snippet',
                id,
                maxResults: 1
            }
        });
        if(!data.items.length) return null;
        return this._formatSong(data.items[0]);
    }

    async loadPlaylist(id = '', pageToken = null, songs = []) {
        const data = await rp({
            url: 'playlistItems',
            qs: {
                part: 'id,snippet',
                playlistId: id,
                maxResults: 50,
                pageToken
            }
        });

        songs.push(...data.items.map(i => this._formatSong(i)));
        if(data.nextPageToken) return this.loadPlaylist(id, data.nextPageToken, songs);
        return songs;
    }

    _formatSong(resource, playlistID) {
        const id = Youtube._fetchID(resource);
        return {
            type: 'youtube',
            trackID: id,
            playlistID,
            title: resource.snippet.title,
            stream: () => {
                return ytdl(`https://www.youtube.com/watch?v=${id}`, {
                    filter: 'audioonly',
                    quality: 'lowest'
                });
            }
        };
    }


    /**
     * Fetch the video ID of a YouTube resource.
     * @param {Object} resource
     * @return {String}
     */
    static _fetchID(resource) {
        switch(resource.kind) {
            case 'youtube#playlistItem':
                return resource.snippet.resourceId.videoId;
            case 'youtube#searchResult':
                return resource.id.videoId;
            default:
                return resource.id;
        }
    }

    /**
     * Get the type of the URL.
     * @param {string} testURL
     * @return {?string}
     */
    static getType(testURL) {
        const parsed = url.parse(testURL, true);

        if(parsed.hostname === 'www.youtube.com' || parsed.hostname === 'youtube.com') {
            if(parsed.pathname === '/watch' && !!parsed.query.v) return Constants.video;
            else if(parsed.pathname === '/playlist' && !!parsed.query.list) return Constants.playlist;

            return null;
        } else if(parsed.hostname === 'www.youtu.be' || parsed.hostname === 'youtu.be') {
            return Constants.shortVideo;
        }
        return null;
    }

    /**
     * Find the ID of any YouTube URL.
     * @param testURL
     * @return {string|null}
     */
    static parseID(testURL) {
        const type = Youtube.getType(testURL);
        const parsed = url.parse(testURL, true);

        let toTest;
        switch (type) {
            case Constants.video:
                toTest = parsed.query.v;
                break;
            case Constants.shortVideo:
                toTest = parsed.pathname.substring(1);
                break;
            case Constants.playlist:
                toTest = parsed.query.list;
                break;
        }

        return Youtube._testID(toTest);
    }

    /**
     * Whether the YouTube link is a front-end URL.
     * @param testURL
     * @return {boolean}
     */
    static isViewURL(testURL) {
        return !!Youtube.parseID(testURL);
    }

    /**
     * Test a string whether it contains a YouTube ID pattern.
     * @param {string} string
     * @return {null|string}
     * @private
     */
    static _testID(string) {
        const idRegex = /[A-Za-z0-9_-]+/;
        return idRegex.test(string) ? string : null;
    }
}

module.exports = Youtube;
