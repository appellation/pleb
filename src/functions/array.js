/**
 * Created by Will on 12/27/2016.
 */

Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
};