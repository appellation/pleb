/**
 * Created by Will on 9/22/2016.
 */

function Help(client, msg, args)    {
    msg.author.sendMessage(
        "**`@mention` in any channel or just type in `#pleb`.**\n\n" +
        "- `play [query, YT URL, SoundCloud URL]` - plays makes a playlist from the link\n" +
        "- `shuffle [Play params]?` - shuffles existing playlist (if exists) or shuffles new playlist\n" +
        "- `add shuffle? [Play params]` - adds stuff to the playlist; optionally shuffle at the same time\n" +
        "- `next [num]?` - skips to next `num` songs\n" +
        "- `pause` - pauses\n" +
        "- `resume` - resumes\n" +
        "- `stfu` - stops and disconnects\n" +
        "- `ping [url]?` - pings the bot or an optional website\n" +
        "- `imgur [title]?` - used with file uploads; uploads a file to Imgur with an optional `title`\n" +
        "- `memes` - get a random meme from /r/memes\n" +
        "- `stats` - get some bot stats\n" +
        "- `dick [mention]?` - get a dick size\n" +
        "- `id` - get your Discord ID (in PM)\n" +
        "- `born` - get your birthday\n" +
        "- `search` - query the internet and get the first result\n" +
        "- `boobs` - get a random photo of boobs [NSFW]\n" +
        "- `ass` - a random photo of ass [NSFW]\n" +
        "- `catfacts` - get a random fact about cats\n" +
        "- `listen` - interpret the next speech by the message author\n" +
        "- `insult [mention]?` - insult a user (defaults to yourself)\n" +
        "- `remind (me|@user) to [action] (in|at) [time]` - set a reminder\n" +
        "- `sanitize [num]?` - delete last `num` messages from the bot (defaults to 10)\n" +
        "- `info` - get info about the bot\n" +
        "NSFW commands (noted by an [NSFW] tag above) can only be given in the `#nsfw` channel or by people with the `nsfw` role.\n\n" +
        "For human help, check out my GitHub repo at <https://github.com/appellation/pleb>"
    , {split: true});
    return Promise.resolve();
}

module.exports = Help;