const YouTubeAPI = require('simple-youtube-api');
const ytdl = require('ytdl-core');

class YouTube {
    constructor() {
        this.api = new YouTubeAPI(process.env.youtube);
    }

    /**
     * Add command arguments to a playlists.  Automatically adds any non-url arguments and a query.
     * @param {string} content
     * @return {Promise<Array>}
     */
    async get(args) {
        const loaded = [], query = [];

        for (const elem of args) {
            const parsed = YouTubeAPI.util.parseURL(elem);
            if (!parsed) {
                query.push(elem);
            } else if (parsed.type === 'video') {
                const resource = await this.api.getVideo(elem);
                if (resource) loaded.push(YouTube.formatSong(resource));
            } else if (parsed.type === 'playlist') {
                const resource = await this.api.getPlaylist(elem);
                loaded.push(...resource.map(r => YouTube.formatSong(r)));
            }
        }

        if (query.length) {
            const resource = await this.api.searchVideos(query.join(' '), 1);
            if (resource.length) loaded.push(resource[0]);
        }

        return loaded;
    }

    static formatSong(video, playlistID) {
        return {
            type: 'youtube',
            trackID: video.id,
            playlistID,
            title: video.title,
            stream: () => {
                return ytdl(video.url, {
                    filter: 'audioonly',
                    quality: 'lowest'
                });
            }
        };
    }
}

module.exports = YouTube;
