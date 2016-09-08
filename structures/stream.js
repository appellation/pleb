/**
 * Created by Will on 8/27/2016.
 */

"use strict";

(function() {

    class StreamStructure   {

        /**
         * Data about a stream.
         * @param {string} url
         * @param {string} name
         * @param {boolean} [file] - Whether the URL points to a file.
         * @constructor
         */
        constructor(url, name, file)  {
            this.url = url;
            this.name = name;
            this.file = file || false;
        }
    }

    module.exports = StreamStructure;
})();