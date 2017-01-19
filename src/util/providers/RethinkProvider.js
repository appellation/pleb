/**
 * Created by Will on 1/18/2017.
 */

const thonk = require('rethinkdbdash');

class RethinkProvider   {
    constructor()   {
        this.r = thonk({
            servers: [{
                host: process.env.rethink
            }],
            db: process.env.rethink_db
        });
    }

    ensureTable(table)   {
        return this.r.tableList().do(list => {
            return this.r.branch(list.contains(table), null, this.r.tableCreate(table));
        }).run();
    }
}

module.exports = RethinkProvider;