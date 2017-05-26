const moment = require('moment');

exports.exec = ({ response: res }) => {
    /**Randomly chooses between XKCD and C&H**/
    if(Math.random() >= 0.5) {
        const max = 4462;
        return res.success('http://explosm.net/comics/' + (Math.floor(Math.random()* max) + 1));
    } else {
        var randVar = Math.floor(Math.random()*(1758 - 1) + 1);

        /** XKCD doesn't have a comic #404. Top kek XKCD. **/
        if(randVar ==404) randVar = Math.floor(Math.random()*(1758 - 1) + 1);

        var xkcd = require('xkcd');
        xkcd(randVar, data => res.send(`${data.title}\n${moment().month(data.month-1).format('MMMM')} ${data.day}, ${data.year}\n${data.img}`));
    }
};
