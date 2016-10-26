/**
 * Created by Will on 10/20/2016.
 */

/**
 * Initialize the CommandOperator factory.
 * @param client
 * @param msg
 * @param body
 * @returns {CommandOperator|boolean}
 */
function cmd(client, msg, body)   {
    if(CommandOperator.valid(client, msg, body))  {
        return new CommandOperator(client, msg, body);
    }   else {
        return false;
    }
}

module.exports = cmd;

const commands = {
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
    ass: require('../commands/ass')
};

class CommandOperator   {

    /**
     * @constructor
     * @param {Client} client - The Discord.js client
     * @param {Message} msg - The message that initiated the command.
     * @param {string} [body] - An optional command body; if this is not provided, the command will default to the message content.
     */
    constructor(client, msg, body)  {
        this.parsed = CommandOperator.parse(body ? body : msg.content);
        this.client = client;
        this.msg = msg;

        console.log("count#command." + this.parsed[0] + "=1");

        // Define commands
        this.commands = commands;
    }

    /**
     * Execute the command.
     * @returns {Promise}
     */
    call()  {
        this.msg.channel.startTyping();

        const self = this;
        return new Promise((resolve, reject) => {
            const func = this.commands[this.parsed[0]];

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
        if (res && typeof res == 'string') {
            this.msg.channel.sendMessage(res);
        }
    }

    /**
     * Check if the a message is a command.  This should be called before constructing.
     * @param {Client} client
     * @param {Message} msg
     * @param {string} [body]
     * @returns {boolean}
     */
    static valid(client, msg, body)   {
        const parsed = CommandOperator.parse(body ? body : msg.content);

        /*
        These are valid command forms:
        - channel name is 'pleb' OR
        - message is a direct message OR
        - the bot is mentioned first

        These are exclusion parameters:
        - author is not the bot
        - the length of the command is > 0
         */
        if((msg.channel.name == 'pleb' || msg.channel.guild == null || CommandOperator.mentionedFirst(msg.content)) && msg.author.id != client.user.id && parsed.length > 0)    {
            return CommandOperator.validFunction(parsed[0]);
        }

        return false;
    }

    /**
     * Check if a given string is a command function.
     * @param {string} str
     * @returns {boolean}
     */
    static validFunction(str) {
        return typeof commands[str] === 'function';
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

        if(CommandOperator.mentionedFirst(msg))    {
            return parts.slice(1);
        }   else    {
            return parts;
        }
    }
}