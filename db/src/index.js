const rethink = require('rethinkdbdash');
module.exports = o => {
  const r = rethink(o);
  r.dbList().contains('pleb').do(r.branch(r.row, r.db('pleb'), r.do(() => r.dbCreate('pleb').do(() => r.db('pleb')))));
  return r.db('pleb');
};
