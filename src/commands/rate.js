/**
 * Created by Will on 1/7/2017.
 */

exports.func = () => {
    let num = Math.floor(Math.random() * 12) + 1;
    return `👌 **${num}/${num === 9 ? 11 : 10}**`;
};