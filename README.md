# Pleb
A really simple Discord bot available for free.  Add me: <https://discordapp.com/oauth2/authorize?client_id=218227587166502923&scope=bot&permissions=3165184>.

## Usage
`@mention` the bot and give a command.

Available commands:

### Music/Audio
- `play [YouTube video URL]` - plays a YouTube video (accepts both youtube.com and youtu.be URLs)
- `play [YouTube playlist URL]` - plays a YouTube playlist in sequential order
- `play [SoundCloud sound URL]` - plays a SoundCloud track
- `play [SoundCloud set URL]` - plays a SoundCloud set in sequential order
- `play [search]` - plays the first YouTube video from a search query
- `shuffle` - shuffles the current playlist, then restarts
- `shuffle [YouTube playlist URL]` - shuffles a YouTube playlist, then plays
- `shuffle [SoundCloud set URL]` - shuffles a SoundCloud set, then plays
- `shuffle [search]` - exactly the same as `play [search]`
- `add [query|URL]` -  add any of a YouTube video, YT playlist, SoundCloud video, SC set, or search query to the end of the playlist
- `add shuffle [query|URL]` - add any of the above to the playlist and then shuffle it
- `next` - skips to next song
- `next [num]` - skips to next `num` song
- `pause` - pauses playback
- `resume` - resumes playback
- `stfu` - stops playback and disconnects Pleb from the voice channel

### Functionality
- `ping` - calculates time between command message and response message
- `ping [URL|IP]` - simple HTTP ping to a website
- `imgur [title?]` - upload an image to Imgur with an optional title; use this in the comment of a file upload

## Development
All commands are prefixed with an @mention of the bot.  The first word after gets interpolated and calls a function as defined in `const commands` in `index.js`, passing in the Discord.js client, the message, and any arguments of the command (defined as text after the command word).  Some commands (e.g. `shuffle` and `add`) rely on other commands.