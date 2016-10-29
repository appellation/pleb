/**
 * Created by Will on 10/29/2016.
 */

/**
 * @param msg
 * @returns {boolean|Filter}
 */
function filter(msg)    {
    const func = Filter.fetch(msg);
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
     * @param {Message} msg
     * @returns {boolean|Function}
     */
    static fetch(msg)    {
        if(msg.author.bot) {
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