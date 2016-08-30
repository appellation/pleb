/**
 * Created by Will on 8/27/2016.
 */

/**
 * Data about a stream.
 * @param {string} url
 * @param {string} name
 * @constructor
 */
function Stream(url, name)   {

    /**
     * Stream data storage.
     * @type {{url: string, name: string}}
     */
    const data = {
        url,
        name
    };

    /**
     * Get stream data.
     * @returns {{url: string, name: string}}
     */
    this.get = function()   {
        return data;
    }
}

module.exports = Stream;