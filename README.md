# Pleb
An eventual Discord bot for free use.

## Usage
All commands are prefixed with an @mention of the bot.  The first word after gets interpolated and instantiates the class of that name as referenced in [line 21 of index.js](https://github.com/appellation/pleb/blob/master/index.js#L21), passing in the Discord.js client, the message, and any arguments of the command (defined as text after the command word).