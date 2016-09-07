/**
 * Created by Will on 9/7/2016.
 */

function Shuffle(client, msg, args) {
    const playlist = msg.server.playlist;
    if(playlist)    {
        playlist.ee.once('shuffled', function() {
            playlist.start(msg);
        });

        playlist.shuffle();
    }
}

module.exports = Shuffle;