/**
 * Created by Will on 10/20/2016.
 */

/**
 * Initialize the Command factory.
 * @param client
 * @param msg
 * @param [body]
 * @returns {Command|boolean}
 */
function cmd(client, msg, body)   {
    if(Command.isValid(msg, body))  {
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
            hello: require('../commands/hello'),
            info: require('../commands/info'),
            sanitize: require('../commands/sanitize')
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
     * @param {{}} [options]
     * @returns {Promise}
     */
    call(options = {respond: true})  {
        this.msg.channel.startTyping();

        const self = this;
        return new Promise((resolve, reject) => {
            const func = Command._list()[self.parsed[0]];

            if(typeof func !== 'function')  {
                reject('not a function.');
            }

            const exec = func(self.client, self.msg, self.parsed.slice(1));

            if(typeof exec !== 'undefined') {
                resolve(exec);
            }   else {
                resolve();
            }
        }).then(res => {
            if(options.respond && typeof res == 'string') {
                return self.msg.channel.sendMessage(res);
            }
            return Promise.resolve(res);
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
     * Check if the a message is a command.  This should be called before constructing.
     * @param {Message} msg
     * @param {string} [body] - optional raw text to be evaluated as a command
     * @returns {boolean}
     */
    static isValid(msg, body)   {
        if(msg.author.bot)  {
            return false;
        }

        const text = body ? body : msg.content;
        const parsed = Command.parse(text);
        const cmd = parsed[0];

        /*
        If the command is NSFW:
        - The message is NOT a direct message AND
        - The author does NOT have the 'nsfw' role AND
        - The channel is NOT named 'nsfw'

        ~ The command is invalid.
         */
        if(Command.isNSFW(cmd))   {
            if(msg.member && !msg.member.roles.find('name', 'nsfw') && msg.channel.name != 'nsfw')   {
                return false;
            }
        }

        /*
         These are valid command forms:
         - channel name is 'pleb' OR
         - message is a direct message OR
         - the bot is mentioned first

         These are exclusion parameters:
         - the length of the command is > 0
         */
        if((msg.channel.name == 'pleb' || msg.channel.guild == null || Command.mentionedFirst(text)) && parsed.length > 0)    {
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
     * @param {string} msg
     * @returns {boolean}
     */
    static mentionedFirst(msg)  {
        const content = msg.split(' ');
        return (content[0] === '<@' + process.env.discord_client_id + '>') || (content[0] === '<@!' + process.env.discord_client_id + '>');
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