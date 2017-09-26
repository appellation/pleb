Array.random = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

RegExp.escape = function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
