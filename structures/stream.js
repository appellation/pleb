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
         * @constructor
         */
        constructor(url, name)  {
            this.url = url;
            this.name = name;
        }
    }

    module.exports = StreamStructure;
})();