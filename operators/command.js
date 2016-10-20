/**
 * Created by Will on 10/20/2016.
 */

function cmd(client, msg)   {
    if(CommandOperator.valid(client, msg))  {
        return new CommandOperator(client, msg);
    }   else {
        return false;
    }
}

module.exports = cmd;

class CommandOperator   {

    constructor(client, msg)  {
        this.parsed = CommandOperator.parse(msg);
        this.client = client;
        this.msg = msg;

        console.log("count#command." + this.parsed[0] + "=1");

        // Define commands
        this.commands = {
            add: require('../commands/add'),
            play: require('../commands/play'),
            stfu: require('../commands/stfu'),
            shuffle: require('../commands/shuffle'),
            pause: require('../commands/pause'),
            resume: require('../commands/resume'),
            next: require('../commands/next'),
            ping: require('../commands/ping'),
            imgur: require('../commands/imgur'),
            help: require('../commands/help'),
            boobs: require('../commands/boobs'),
            memes: require('../commands/memes'),
            stats: require('../commands/stats'),
            dick: require('../commands/dick'),
            id: require('../commands/id'),
            born: require('../commands/born'),
            search: require('../commands/search'),
            insult: require('../commands/insult'),
            catfacts: require('../commands/catfacts'),
            listen: require('../commands/listen')
        };
    }

    /**
     * Execute the command.
     * @returns {Promise}
     */
    call()  {
        this.msg.channel.startTyping();
        const exec = this.commands[this.parsed[0]](this.client, this.msg, this.parsed.slice(1));

        if(typeof exec !== 'undefined' && typeof exec.then === 'function') {
            const self = this;

            return exec.then(res => {
                self.msg.channel.stopTyping();
                return res;
            }).catch(err => {
                console.error(err);
                self.msg.reply(err);
                self.msg.channel.stopTyping();
            });
        }   else {
            this.msg.channel.stopTyping();
        }
    }

    /**
     * Send a response to a command.
     * @param {string} res - The result of a command call.
     * @see call
     */
    respond(res)   {
        if (res && typeof res == 'string') {
            this.msg.channel.sendMessage(res);
        }
    }

    /**
     * Check if the command is valid.  This should be called before constructing.
     * @param {Client} client
     * @param {Message} msg
     * @returns {boolean}
     */
    static valid(client, msg)   {
        if(msg.author.id === client.user.id || CommandOperator.parse(msg).length == 0)    {
            return false;
        }

        if(msg.channel.name == 'pleb' || msg.channel.guild == null) {
            return true;
        }

        if(CommandOperator.mentionedFirst(msg.content)) {
            return true;
        }

        return false;
    }

    /**
     * Check if the bot was mentioned first.
     * @param {string} content
     * @returns {boolean}
     */
    static mentionedFirst(content)  {
        const parts = content.split(' ');
        return (parts[0] === '<@' + process.env.discord_client_id + '>') || (parts[0] === '<@!' + process.env.discord_client_id + '>');
    }

    /**
     * Parse an incoming command.
     * @param {Message} msg
     * @returns {[]}
     */
    static parse(msg)    {
        const parts = msg.content.split(' ');

        if(msg.channel.name === 'pleb' || msg.channel.guild == null) {
            if(CommandOperator.mentionedFirst(msg.content))    {
                return parts.slice(1);
            }   else    {
                return parts;
            }
        }   else {
            return parts.slice(1);
        }
    }
}