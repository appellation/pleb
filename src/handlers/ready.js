/**
 * Created by Will on 12/6/2016.
 */

const playlists = require('../util/storage/playlists');

module.exports = () => {
    for(const [, p] of playlists) p.stop('continue');
};