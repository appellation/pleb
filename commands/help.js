/**
 * Created by Will on 9/22/2016.
 */

function Help(client, msg, args)    {
    msg.author.sendMessage(
        "- `play [query, YT URL, SoundCloud URL]` - plays makes a playlist from the link\n" +
        "- `shuffle [Play params]?` - shuffles existing playlist (if exists) or shuffles new playlist\n" +
        "- `add shuffle? [Play params]` - adds stuff to the playlist; optionally shuffle at the same time\n" +
        "- `next [num]?` - skips to next `num` songs\n" +
        "- `pause` - pauses\n" +
        "- `resume` - resumes\n" +
        "- `stfu` - stops and disconnects\n" +
        "- `ping [url]?` - pings the bot or an optional website\n" +
        "- `imgur [title]?` - used with file uploads; uploads a file to Imgur with an optional `title`\n" +
        "- `memes` - get a random meme from /r/memes" +
        "- `stats` - get some bot stats"
    );
}

module.exports = Help;