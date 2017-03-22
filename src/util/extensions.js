/**
 * Created by Will on 12/27/2016.
 */

Array.random = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
};

RegExp.escape = function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};