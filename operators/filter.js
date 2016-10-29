/**
 * Created by Will on 10/29/2016.
 */

/**
 * @param {Client} client
 * @param msg
 * @returns {boolean|Filter}
 */
function filter(client, msg)    {
    const func = Filter.fetch(client, msg);
    if(func) {
        return new Filter(msg, func);
    }   else {
        return false;
    }
}

module.exports = filter;

class Filter    {

    /**
     * @constructor
     * @param {Message} msg
     * @param {Function} func
     */
    constructor(msg, func)    {
        console.log("count#filter");

        this.msg = msg;
        this.func = func;
    }

    call()  {
        Promise.resolve(this.func(this.msg)).then(res => {
            if(res) {
                this.msg.channel.sendMessage(res);
            }
        }).catch(console.error);
    }

    /**
     * Get the list of filters.
     * @returns {Map}
     */
    static list() {
        const arr = [
            [
                /^ay+$/i,
                require('../filters/ay.js')
            ],
            [
                /(\s|^)(x(d|D)|XD)(\s|$)/,
                require('../filters/xd')
            ],
            [
                /(\s|^)ecks dee(\s|$)/i,
                require('../filters/xd')
            ]
        ];

        return new Map(arr);
    }

    /**
     * Fetch a filter function
     * @param {Client} client
     * @param {Message} msg
     * @returns {boolean|Function}
     */
    static fetch(client, msg)    {
        if(client.user.id == msg.author.id) {
            return false;
        }

        const content = msg.content;
        const list = Filter.list();

        for(let [key, val] of list.entries()) {
            if(key.test(content))   {
                return val;
            }
        }

        return false;
    }
}