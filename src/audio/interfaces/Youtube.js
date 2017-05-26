const YouTubeAPI = require('simple-youtube-api');
const ytdl = require('ytdl-core');

class YouTube {
    constructor() {
        this.api = new YouTubeAPI(process.env.youtube);
    }

    /**
     * Add command arguments to a playlists.  Automatically adds any non-url arguments and a query.
     * @param {string} content
     * @return {Promise<Array<Song>>}
     */
    async get(args) {
        const loaded = [], query = [];

        for (const elem of args) {
            const parsed = YouTubeAPI.util.parseURL(elem);
            if (!parsed) {
                query.push(elem);
            } else if (parsed.type === 'video') {
                const video = await this.api.getVideo(elem);
                if (video) loaded.push(YouTube.formatSong(video));
            } else if (parsed.type === 'playlist') {
                const playlist = await this.api.getPlaylist(elem);
                const videos = await playlist.getVideos();
                loaded.push(...videos.map(v => YouTube.formatSong(v)));
            }
        }

        if (query.length) {
            const resource = await this.api.searchVideos(query.join(' '), 1);
            if (resource.length) loaded.push(YouTube.formatSong(resource[0]));
        }

        return loaded;
    }

    async getPlaylistQuery(query) {
        const playlists = await this.api.searchPlaylists(query, 1);
        const videos = await playlists[0].getVideos();
        return videos.map(v => YouTube.formatSong(v));
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
