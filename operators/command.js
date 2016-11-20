/**
 * Created by Will on 10/20/2016.
 */

const pmx = require('pmx');

/**
 * Initialize the Command factory.
 * @param client
 * @param msg
 * @param [body]
 * @returns {Command|boolean}
 */
function cmd(client, msg, body)   {
    const validated = Command.validate(msg, body);
    if(validated)  {
        return new Command(validated, client, msg, body);
    }   else {
        return false;
    }
}

module.exports = cmd;

class Command   {

    static _list() {
        const arr = [
            [
                'add',
                require('../commands/add')
            ],
            [
                'play',
                require('../commands/play')
            ],
            [
                'stfu',
                require('../commands/stfu')
            ],
            [
                'shuffle',
                require('../commands/shuffle')
            ],
            [
                'pause',
                require('../commands/pause')
            ],
            [
                'resume',
                require('../commands/resume')
            ],
            [
                'next',
                require('../commands/next')
            ],
            [
                'ping',
                require('../commands/ping')
            ],
            [
                'imgur',
                require('../commands/imgur')
            ],
            [
                'help',
                require('../commands/help')
            ],
            [
                'boobs',
                require('../commands/boobs')
            ],
            [
                'memes',
                require('../commands/memes')
            ],
            [
                'stats',
                require('../commands/stats')
            ],
            [
                'dick',
                require('../commands/dick')
            ],
            [
                'id',
                require('../commands/id')
            ],
            [
                'born',
                require('../commands/born')
            ],
            [
                'search',
                require('../commands/search')
            ],
            [
                'insult',
                require('../commands/insult')
            ],
            [
                'catfacts',
                require('../commands/catfacts')
            ],
            [
                'listen',
                require('../commands/listen')
            ],
            [
                'ass',
                require('../commands/ass')
            ],
            [
                'remind',
                require('../commands/remind')
            ],
            [
                'eval',
                require('../commands/eval')
            ],
            [
                /^(hi|hello)$/,
                require('../commands/hello')
            ],
            [
                'info',
                require('../commands/info')
            ],
            [
                'sanitize',
                require('../commands/sanitize')
            ],/*
            [
                'restrict',
                require('../commands/restrict')
            ],*/
            [
                /^ay+$/i,
                require('../commands/ayy')
            ],
            [
                /^(xD|XD)$/,
                require('../commands/xd')
            ],
            [
                /^(roll|dice)$/,
                require('../commands/dice')
            ],
            [
                'coinflip',
                require('../commands/coinflip')
            ],
            [
                '8ball',
                require('../commands/8ball')
            ],
            [
                'weather',
                require('../commands/weather')
            ],
            [
                'morse',
                require('../commands/morse')
            ],
            [
                'def',
                require('../commands/def')
            ],
            [
                'prev',
                require('../commands/prev')
            ]/*,
            [
                'emojify',
                require('../commands/emojify')
            ]*/
        ];

        return new Map(arr);
    };

    static _nsfwList()   {
        return [
            'boobs',
            'ass'
        ]
    }

    /**
     * @constructor
     * @param {Function} func - The function to call with the command.
     * @param {Client} client - The Discord.js client
     * @param {Message} msg - The message that initiated the command.
     * @param {string} [body] - An optional command body; if this is not provided, the command will default to the message content.
     */
    constructor(func, client, msg, body)  {
        this.func = func;
        this.parsed = Command.parse(body ? body : msg.content);
        this.client = client;
        this.msg = msg;
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
            if(typeof self.func !== 'function')  {
                return reject('not a function.');
            }

            pmx.emit('command', {
                text: this.parsed[0],
                func: self.func.name
            });

            const exec = self.func(self.client, self.msg, self.parsed.slice(1));

            if(typeof exec !== 'undefined') {
                return resolve(exec);
            }   else {
                return resolve();
            }
        }).then(res => {
            if(options.respond && typeof res == 'string' && res.length > 0) {
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
     * @returns {Function|undefined}
     */
    static validate(msg, body)   {
        if(msg.author.bot)  {
            return;
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
                return;
            }
        }

        /*
         These are valid command forms:
         - channel name is 'pleb' OR
         - message is a direct message OR
         - the bot is mentioned first OR
         - a raw body is provided

         These are exclusion parameters:
         - the length of the command is > 0
         */
        if((msg.channel.name == 'pleb' || msg.channel.guild == null || Command.mentionedFirst(text) || body) && parsed.length > 0)    {
            return Command.fetch(cmd);
        }
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
     * @returns {Function}
     */
    static fetch(str) {
        if(typeof Command._list().get(str) == 'function')    {
            return Command._list().get(str);
        }

        for(const [key, val] of Command._list())    {
            if(typeof key == 'string')  {
                if(key === str) {
                    return val;
                }
            }   else if(str.match(key))  {
                return val;
            }
        }

        return null;
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