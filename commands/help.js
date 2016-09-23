/**
 * Created by Will on 9/22/2016.
 */

function Help(client, msg, args)    {
    msg.author.sendMessage(
        "`play [query, {YT URL}, {SoundCloud URL}]` - plays makes a playlist from the link\n" +
        "`shuffle [void, {Play params}` - shuffles existing playlist (if exists) or shuffles new playlist\n" +
        "`add [{Play params}]` - adds stuff to the end of the playlist\n" +
        "`add shuffle [{Play params}]` - same as `add` but shuffles playlist\n" +
        "`next [number?]` - skips to next `num` songs\n" +
        "`pause` - pauses\n" +
        "`resume` - resumes\n" +
        "`stfu` - stops and disconnects\n" +
        "`ping [url?]` - pings the bot or an optional website\n" +
        "`imgur [title?]` - used with file uploads; uploads a file to Imgur with an optional `title`"
    );
}

module.exports = Help;