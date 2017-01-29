/**
 * Created by Will on 1/7/2017.
 */

exports.func = res => {
    const num = Math.floor(Math.random() * 12) + 1;
    return res.success(`👌 **${num}/${num === 9 ? 11 : 10}**`);
};

exports.validator = (msg, args) => args.length > 0;