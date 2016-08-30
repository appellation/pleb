# Pleb
![pleb](http://i.imgur.com/dYcWGTC.png)

A really simple Discord bot available for free.  Add me: <https://discordapp.com/oauth2/authorize?client_id=218227587166502923&scope=bot&permissions=3165184>.

## Development
All commands are prefixed with an @mention of the bot.  The first word after gets interpolated and instantiates the class of that name as referenced in [line 21 of index.js](https://github.com/appellation/pleb/blob/master/index.js#L21), passing in the Discord.js client, the message, and any arguments of the command (defined as text after the command word).

## Usage
Command prefix: **`@mention`** *(`mention` being the bot.  Obviously.  Geez.)*

Available commands:

- `play [YouTube video URL]` - plays a YouTube video (accepts both youtube.com and youtu.be URLs)
- `play [YouTube playlist URL]` - plays a YouTube playlist in sequential order
- `play [search]` - plays the first video from a search query
- `stfu` - stops playback and disconnects Pleb from the voice channel