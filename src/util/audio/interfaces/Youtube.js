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

const Constants = {
    video: 'video',
    playlist: 'playlist',
    shortVideo: 'short video'
};

class Youtube   {

    constructor(list)   {
        this.playlist = list;
    }

    add(args)   {
        const urls = [];
        const query = args.reduce((prev, cur) => {
            if(Youtube.isViewURL(cur)) {
                urls.push(cur);
                return prev;
            }   else {
                return `${prev} ${cur}`;
            }
        }, urls[0]);

        const resolved = [];
        resolved.push(this.loadQuery(query));
        for(const resource of urls) {
            const type = Youtube.getType(resource);
            const id = Youtube.parseID(resource);

            let load;
            if(type === Constants.video || type === Constants.shortVideo) load = this.loadTrack(id);
            else if(type === Constants.playlist) load = this.loadPlaylist(id);

            resolved.push(load);
        }

        return Promise.all(resolved.filter(e => e));
    }

    loadQuery(query)   {
        if(!query) return;
        return rp.get({
            uri: 'search',
            qs: {
                part: 'snippet',
                q: query,
                maxResults: 1,
                type: 'video'
            }
        }).then(res => {
            if(res.items.length === 0) return;
            return this.loadTrack(res.items[0].id.videoId);
        });
    }

    loadPlaylist(id, pageToken = null) {
        return rp.get({
            uri: 'playlistItems',
            qs: {
                part: 'snippet',
                playlistId: id,
                maxResults: 50,
                pageToken: pageToken
            }
        }).then(res => {
            this._addPlaylist(res);
            if(res.nextPageToken) return this.loadPlaylist(id, res.nextPageToken);
            return this;
        });
    }

    loadTrack(id)  {
        return rp.get({
            uri: 'videos',
            qs: {
                part: 'liveStreamingDetails,snippet,contentDetails,id',
                id: id,
                maxResults: 1
            }
        }).then(res => {
            return this._addTrack(res.items[0]);
        });
    }

    _addPlaylist(resource) {
        const tracks = [];
        for(const item of resource.items) tracks.push(this.loadTrack(item.snippet.resourceId.videoId));
        return Promise.all(tracks);
    }

    _addTrack(resource) {
        if(resource.liveStreamingDetails) return;
        this.playlist.addSong({
            name: resource.snippet.title,
            url: `https://youtu.be/${resource.id}`,
            duration: resource.contentDetails.duration,
            type: 'youtube',
            stream: () => {
                return ytdl(`https://www.youtube.com/watch?v=${resource.id}`, {
                    quality: 'lowest',
                    filter: 'audioonly'
                });
            }
        });
    }

    static getType(testURL) {
        const parsed = url.parse(testURL, true);

        if(parsed.hostname === 'www.youtube.com' || parsed.hostname === 'youtube.com')  {
            if(parsed.pathname === '/watch' && !!parsed.query.v)            return Constants.video;
            else if(parsed.pathname === '/playlist' && !!parsed.query.list) return Constants.playlist;

            return null;
        }   else if(parsed.hostname === 'www.youtu.be' || parsed.hostname === 'youtu.be')   {
            return Constants.shortVideo;
        }
        return null;
    }

    static parseID(testURL) {
        const type = Youtube.getType(testURL);
        const parsed = url.parse(testURL, true);

        let toTest;
        switch (type)   {
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

    static isViewURL(testURL)   {
        return !!Youtube.parseID(testURL);
    }

    static _testID(string) {
        const idRegex = /[A-Za-z0-9_-]+/;
        return idRegex.test(string) ? string : null;
    }
}

module.exports = Youtube;