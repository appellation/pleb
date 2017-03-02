# Pleb
[![Build Status](https://travis-ci.org/appellation/pleb.svg?branch=master)](https://travis-ci.org/appellation/pleb)

A simple Discord bot available for free.  [Click here](https://discordapp.com/oauth2/authorize?permissions=3197952&scope=bot&client_id=218227587166502923) to add me.

## Usage
`@mention` the bot in any channel or just type in `#pleb` to give a command.  Users with the `no-pleb` role won't be able to use commands.  NSFW commands will be unavailable except for people with the `nsfw` role or in a `nsfw` channel.

### Commands:

#### Music/Audio
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
- `loop [YouTube video URL]` - loops a YouTube video (accepts both youtube.com and youtu.be URLs)
- `loop [SoundCloud sound URL]` - loops a SoundCloud track
- `loop [search]` - loops the first YouTube video from a search query
- `next` - skips to next song
- `next [num]` - skips to next `num` song
- `prev` - goes back one song
- `prev [num]` - goes back `num` songs
- `pause` - pauses playback
- `resume` - resumes playback
- `stfu` - stops playback and disconnects Pleb from the voice channel
- `listen` - converts speech to text when message author speaks the next time
- `queue [page]?` - list the next 5 songs; optionally provide a page number
- `playlist [query]` -  query for a YouTube playlist

#### Functionality
- `config prefix <value>` - set prefix.
- `ping` - calculates time between command message and response message
- `ping [URL]` - simple HTTP ping to a website
- `stats` - get some bot stats
- `id` - PM user ID
- `born` - get your birthday
- `search [query]` - query the internet and post the first result
- `help` - PM some help
- `remind (me|@user) to [action] (in|at) [time]` - set a reminder
- `sanitize` - delete last 3 messages from bot
- `sanitize [num]` - deleted last `num` messages from bot
- `info` - get bot info
- `weather [location]` - get current weather at a location
- `weather (currently|minutely|hourly|daily) [location]` - get weather as specified for a location
- `link` - get the bot's invite link
- `define [word]` - define a word

#### Random
- `imgur [title?]` - upload an image to Imgur with an optional title; use this in the comment of a file upload
- `boobs` - get a random photo of boobs [NSFW]
- `ass` - get a random photo of ass [NSFW]
- `memes` -  get a random meme from Cyanide & Happiness or xkcd
- `dick [mention]?` - get a dick size
- `catfacts` - send a random cat fact
- `dice|roll ([count] [size])` - roll `count` dice with `size` sides (defaults to 2 6-sided dice)
- `coinflip` - flip a coin
- `/ay+/i` - lmao
- `xD|XD` - XD
- `morse [text]` - convert given text to morse
- `8ball [question]` - ask a question of the all-knowing 8-ball
- `hello|hi|hey|wassup` - :wave:

## Support
If you have any questions, contact a dev at [our (admittedly small) discord](https://discord.gg/DPuaDvP).