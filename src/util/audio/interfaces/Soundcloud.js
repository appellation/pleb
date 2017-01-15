/**
 * Created by Will on 1/14/2017.
 */

const url = require('url');
const request = require('request');
const rp = require('request-promise-native').defaults({
    baseUrl: 'https://api.soundcloud.com',
    followAllRedirects: true,
    qs: {
        client_id: process.env.soundcloud
    },
    json: true
});

class Soundcloud {

    /**
     * @param {Playlist} list
     */
    constructor(list)   {
        this.playlist = list;
    }

    add(args)    {
        const urls = args.filter(e => Soundcloud.isViewURL(e));
        const resolved = [];
        for(const resource of urls) {
            resolved.push(this._loadResource(resource));
        }
        return Promise.all(resolved).then(() => this.playlist);
    }

    _loadResource(url)  {
        return rp.get({
            uri: 'resolve',
            qs: {
                url
            }
        }).then(thing => {
            switch (thing.kind) {   /* eslint-disable indent */
                case 'playlist':
                    return this._addPlaylist(thing);
                case 'track':
                    return this._addTrack(thing);
            }   /* eslint-enable indent */
        });
    }

    _addPlaylist(resource)  {
        for(const track of resource.tracks) this._addTrack(track);
    }

    _addTrack(track) {
        if(!track.streamable) return;
        this.playlist.addSong({
            name: track.title,
            url: track.permalink_url,
            type: 'soundcloud',
            duration: track.duration,
            stream: () => {
                return request.get({
                    uri: track.stream_url,
                    followAllRedirects: true,
                    qs: { client_id: process.env.soundcloud },
                    encoding: null
                });
            }
        });
    }

    /**
     * @param {String} testURL
     * @return {boolean}
     */
    static isViewURL(testURL)    {
        const parsed = url.parse(testURL);
        const parts = parsed.pathname.split('/');
        return (parsed.hostname === 'soundcloud.com' || parsed.hostname === 'www.soundcloud.com') && parts.length >= 2;
    }
}

module.exports = Soundcloud;