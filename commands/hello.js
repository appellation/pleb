/**
 * Created by Will on 10/27/2016.
 */

/**
 * @param {Message} msg
 * @param {[]} args
 */
function Hello(msg, args)   {
    return msg.reply('Hey! I\'m a pleb! :wave:');
}

module.exports = {
    func: Hello,
    triggers: [
        'hello',
        'hi',
        'hey',
        'sup',
        'wassup'
    ]
};
