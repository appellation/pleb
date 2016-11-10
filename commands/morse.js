/**
 * Created by Will on 11/9/2016.
 */

const dot = '.';
const dash = '-';
const dict = {
    a: dot + dash,
    b: dash + dot + dot + dot,
    c: dash + dot + dash + dot,
    d: dash + dot + dot,
    e: dot,
    f: dot + dot + dash + dot,
    g: dash + dash + dot,
    h: dot + dot + dot,
    i: dot + dot,
    j: dot + dash + dash + dash,
    k: dash + dot + dash,
    l: dot + dash + dot + dot,
    m: dash + dash,
    n: dash + dot,
    o: dash + dash + dash,
    p: dot + dash + dash + dot,
    q: dash + dash + dot + dash,
    r: dot + dash + dot,
    s: dot + dot + dot,
    t: dash,
    u: dot + dot + dash,
    v: dot + dot + dot + dash,
    w: dot + dash + dash,
    x: dash + dot + dot + dash,
    y: dash + dot + dash + dash,
    z: dash + dash + dot + dot,
    0: dash + dash + dash + dash + dash,
    1: dot + dash + dash + dash + dash,
    2: dot + dot + dash + dash + dash,
    3: dot + dot + dot + dash + dash,
    4: dot + dot + dot + dot + dash,
    5: dot + dot + dot + dot + dot,
    6: dash + dot + dot + dot + dot,
    7: dash + dash + dot + dot + dot,
    8: dash + dash + dash + dot + dot,
    9: dash + dash + dash + dash + dot
};

/**
 * @param client
 * @param msg
 * @param args
 * @returns {string|Promise|undefined}
 */
function Morse(client, msg, args)   {
    if(args.length == 0) return;

    let out = '';
    const low = args.join().toLowerCase();

    for(let i = 0; i < low.length; i++) {
        if(!dict[low[i]]) continue;
        out += dict[low[i]] + ' ';
    }

    return Promise.all([
        msg.channel.sendMessage(out + '', {split: {char: ' '}}),
        msg.delete()
    ]);
}

module.exports = Morse;