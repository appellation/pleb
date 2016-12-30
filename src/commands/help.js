/**
 * Created by Will on 9/22/2016.
 */

exports.func = msg => {
    return msg.author.sendMessage(
        '**`@mention` in any channel or just type in `#pleb`.**\n\n' +
        '- **play [query, YT URL, SoundCloud URL]** - plays makes a playlist from the link\n' +
        '- **shuffle [Play params]?** - shuffles existing playlist (if exists) or shuffles new playlist\n' +
        '- **add shuffle? [Play params]** - adds stuff to the playlist; optionally shuffle at the same time\n' +
        '- **next [num]?** - skips to next **num** songs (default 1)\n' +
        '- **prev [num]?** - returns **num** songs (default 1)' +
        '- **pause** - pauses\n' +
        '- **resume** - resumes\n' +
        '- **stfu** - stops and disconnects\n' +
        '- **queue [page]?** - show song queue: next 5 or page number\n' +
        '- **vol [num]** - set volume.  10 is normal, 20 is double, etc.  Must not be more than 50.\n' +
        '- **playlist [query]** - search YouTube for a playlist and play it\n\n' +
        '- **ping [url]?** - pings the bot or an optional website\n' +
        '- **imgur [title]?** - used with file uploads; uploads a file to Imgur with an optional **title**\n' +
        '- **memes** - get a random meme from Cyanide & Happiness or xkcd\n' +
        '- **stats** - get some bot stats\n' +
        '- **dick [mention]?** - get a dick size\n' +
        '- **id [user|channel|role mention]?** - get Discord IDs (defaults to yourself)\n' +
        '- **born** - get your birthday\n' +
        '- **search** - query the internet and get the first result\n' +
        '- **boobs** - get a random photo of boobs **[NSFW]**\n' +
        '- **ass** - a random photo of ass **[NSFW]**\n' +
        '- **catfacts** - get a random fact about cats\n' +
        '- **listen** - interpret the next speech by the message author\n' +
        '- **insult [mention]?** - insult a user (defaults to yourself)\n' +
        '- **remind (me|@user) to [action] (in|at) [time]** - set a reminder\n' +
        '- **sanitize [num]?** - delete last **num** messages from the bot (defaults to 3)\n' +
        '- **info** - get info about the bot\n' +
        '- **/ay+/i** - lmao\n' +
        '- **xD|XD** - XD\n' +
        '- **hello|hi** - :wave:\n' +
        '- **roll|dice ([count] [size])?** - roll **count** dice with **size** sides (defaults to 2 6-sided dice)\n' +
        '- **coinflip** - flip a coin\n' +
        '- **weather (currently|minutely|hourly|daily)? [location]** - get weather (defaults to currently) for a **location**\n' +
        '- **morse [text]** - convert given text to morse code\n' +
        '- **define [word]** - get the dictionary definition for a given word\n' +
        '- **link** - get the invitie link for the bot\n\n' +
        'NSFW commands (noted by an [NSFW] tag above) can only be given in the `#nsfw` channel or by people with the `nsfw` role.  Members with the `no-pleb` role will be unable to use commands.\n\n' +
        'For human help, check out my Discord server (<https://discord.gg/DPuaDvP>) or my GitHub repo (<https://github.com/appellation/pleb>)'
        , {split: true});
};