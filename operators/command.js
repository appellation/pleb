/**
 * Created by Will on 10/20/2016.
 */

const rp = require('request-promise-native');
const fsX = require('fs-extra');
const fs = require('fs');

const commands = (() => {
    return new Promise(resolve => {
        const files = [];
        const walker = fsX.walk('../commands');

        walker.on('file', (root, stat, next) => {
            files.push(root + stat.name);
        });
        walker.on('end', () => {
            resolve(files);
        });
    }).then(files => {
        const contents = new Map();
        for(const file of files)    {
            const mod = require(file);
            if(mod.triggers && typeof mod.triggers[Symbol.iterator] === 'function')  {
                for(const trigger of mod.triggers)  {
                    contents.set(trigger, {
                        func: mod.func,
                        validation: mod.validation
                    });
                }
            }   else    {
                contents.set(mod.triggers, {
                    fun: mod.func,
                    validation: mod.validation
                });
            }
        }
        return contents;
    });
})();

/**
 * @typedef {Object} CommandStructure
 * @property {Function} func
 * @property {Iterable|Object} triggers
 * @property {Function} [validation]
 * @property {[CommandStructure]} [options]
 */

function Command(message)   {
    //
}

module.exports = Command;