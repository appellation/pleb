const moment = require('moment');
const xkcd = require('xkcd');
const { number } = require('../../util/random');

exports.exec = ({ response: res }) => {
    /**Randomly chooses between XKCD and C&H**/
    if (Math.random() >= 0.5) {
        return res.success(`http://explosm.net/comics/${number(4462)}`);
    } else {
        let num;
        do {
            num = number(1758);
        } while (num === 404);

        xkcd(num, data => res.send(`${data.title}\n${moment().month(data.month-1).format('MMMM')} ${data.day}, ${data.year}\n${data.img}`));
    }
};
