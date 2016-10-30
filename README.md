# Pleb
A really simple Discord bot available for free.  Add me: <https://discordapp.com/oauth2/authorize?client_id=218227587166502923&scope=bot&permissions=3173376>.

## Usage
`@mention` the bot in any channel or just type in `#pleb` to give a command.  **Warning:** there aren't any checks on command authorization, so don't use this bot if you're worried about trolls.

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
- `next` - skips to next song
- `next [num]` - skips to next `num` song
- `pause` - pauses playback
- `resume` - resumes playback
- `stfu` - stops playback and disconnects Pleb from the voice channel
- `listen` - converts speech to text when message author speaks the next time

#### Functionality
- `ping` - calculates time between command message and response message
- `ping [URL]` - simple HTTP ping to a website
- `stats` - get some bot stats
- `id` - PM user ID
- `born` - get your birthday
- `search [query]` - query the internet and post the first result
- `help` - PM some help
- `remind (me|@user) to [action] (in|at) [time]` - set a reminder
- `sanitize` - delete last 10 messages from bot
- `sanitize [num]` - deleted last `num` messages from bot
- `info` - get bot info

#### Random
- `imgur [title?]` - upload an image to Imgur with an optional title; use this in the comment of a file upload
- `boobs` - get a random photo of boobs
- `memes` -  get a random meme from `/r/memes`
- `dick [mention]?` - get a dick size
- `catfacts` - send a random cat fact

## Development
`npm install`

Create a bot on <https://discordapp.com/developers/applications/me>.

You'll need to make a `.env` file (or have some other way to access environment variables) with the below data:

- `discord` - your Discord app secret
- `discord_client_id` - your Discord app client ID
- `youtube` - a Google API browser key authorized for YouTube Data
- `raven` - a Sentry.io logging URL; optional
- `soundcloud` - a SoundCloud client ID
- `soundcloud_secret` - a SoundCloud secret
- `imgur` - a Imgur client ID
- `bing` - a Bing API access key
- `google_cloud_email` - a Google Cloud service account email
- `google_cloud_project_id` - a Google Cloud project ID
- `google_cloud_private_key` - a Google Cloud service account private key (make sure to double-quote this)
- `reddit` - a Reddit app key
- `reddit_secret` a Reddit app secret

Add your bot to a server using `https://discordapp.com/oauth2/authorize?client_id=<YOUR_CLIENT_ID>&scope=bot&permissions=3173376`.

The first word of a command gets interpolated and calls a function as defined in `static list()` in `operators/command.js`, passing in the Discord.js client, the message, and any arguments of the command (defined as text after the command word).  Some commands (e.g. `shuffle` and `add`) rely on other commands.