/**
 * Created by Will on 10/20/2016.
 */

/**
 * Initialize the Command factory.
 * @param client
 * @param msg
 * @param body
 * @returns {Command|boolean}
 */
function cmd(client, msg, body)   {
    if(Command.isValid(client, msg, body))  {
        return new Command(client, msg, body);
    }   else {
        return false;
    }
}

module.exports = cmd;

class Command   {

    static _list() {
        return {
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
            listen: require('../commands/listen'),
            ass: require('../commands/ass'),
            remind: require('../commands/remind'),
            eval: require('../commands/eval'),
            hi: require('../commands/hello'),
            hello: require('../commands/hello')
        }
    };

    static _nsfwList()   {
        return [
            'boobs',
            'ass'
        ]
    }

    /**
     * @constructor
     * @param {Client} client - The Discord.js client
     * @param {Message} msg - The message that initiated the command.
     * @param {string} [body] - An optional command body; if this is not provided, the command will default to the message content.
     */
    constructor(client, msg, body)  {
        this.parsed = Command.parse(body ? body : msg.content);
        this.client = client;
        this.msg = msg;

        console.log("count#command." + this.parsed[0] + "=1");
    }

    /**
     * Execute the command.
     * @returns {Promise}
     */
    call()  {
        this.msg.channel.startTyping();

        const self = this;
        return new Promise((resolve, reject) => {
            const func = Command._list()[this.parsed[0]];

            if(typeof func !== 'function')  {
                reject('not a function.');
            }

            const exec = func(this.client, this.msg, this.parsed.slice(1));

            if(typeof exec !== 'undefined') {
                resolve(exec);
            }   else {
                resolve();
            }
        }).then(res => {
            self.msg.channel.stopTyping();
            return res;
        }).catch(err => {
            console.error(err);
            self.msg.reply(err);
            self.msg.channel.stopTyping();
        });
    }

    /**
     * Send a response to a command.
     * @param {string} res - The result of a command call.
     * @see call
     */
    respond(res)   {
        if (res) {
            this.msg.channel.sendMessage(res);
        }
    }

    /**
     * Check if the a message is a command.  This should be called before constructing.
     * @param {Client} client
     * @param {Message} msg
     * @param {string} [body] - optional raw text to be evaluated as a command
     * @returns {boolean}
     */
    static isValid(client, msg, body)   {
        const text = body ? body : msg.content;
        const parsed = Command.parse(text);
        const cmd = parsed[0];

        /*
        If the command is NSFW:
        - The author does NOT have the 'nsfw' role AND
        - The channel is NOT named 'nsfw' AND
        - The message is NOT a direct message

        ~ The command is invalid.
         */
        if(Command.isNSFW(cmd))   {
            if(!msg.member.roles.find('name', 'nsfw') && msg.channel.name != 'nsfw' && msg.channel.guild != null)   {
                return false;
            }
        }

        /*
         These are valid command forms:
         - channel name is 'pleb' OR
         - message is a direct message OR
         - the bot is mentioned first

         These are exclusion parameters:
         - author is not the bot
         - the length of the command is > 0
         */
        if((msg.channel.name == 'pleb' || msg.channel.guild == null || Command.mentionedFirst(text)) && msg.author.id != client.user.id && parsed.length > 0)    {
            return Command.isValidFunction(cmd);
        }

        return false;
    }

    /**
     * Check if a command is NSFW.
     * @param {String} str
     * @returns {boolean}
     */
    static isNSFW(str)  {
        return Command._nsfwList().indexOf(str) !== -1;
    }

    /**
     * Check if a given string is a command function.
     * @param {string} str
     * @returns {boolean}
     */
    static isValidFunction(str) {
        return typeof Command._list()[str] === 'function';
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
     * @param {string} msg
     * @returns {[]}
     */
    static parse(msg)    {
        const parts = msg.split(' ');

        if(Command.mentionedFirst(msg))    {
            return parts.slice(1);
        }   else    {
            return parts;
        }
    }
}