/**
 * Created by Will on 10/20/2016.
 */

const rp = require('request-promise-native');
const fsX = require('fs-extra');
const fs = require('fs');

const commands = CommandOperator.fetchCommands();
const prefixes = [
    `<@${process.env.discord_client_id}> `,
    `<!@${process.env.discord_client_id}> `
];

/**
 * @typedef {Object} CommandStructure
 * @property {Function} func
 * @property {Iterable|Object} triggers
 * @property {Function} [validation]
 * @property {[CommandStructure]} [options]
 */

function Command(message, body)   {
    let content;
    if(body)    {
        content = body;
    }   else {
        for(const pref of prefixes) {
            if(message.content.startsWith(pref)) {
                content = message.content.substring(pref.length);
                break;
            }
        }
        if(!content) return;
    }

    let command;
    for(const cmd of commands.keys())  {
        if(cmd instanceof RegExp)   {
            if(content.match(cmd))  {
                command = commands.get(cmd);
                break;
            }
        }   else if(typeof cmd === 'string')    {
            if(content.startsWith(cmd)) {
                command = commands.get(cmd);
                break;
            }
        }
    }
    if(!command) return;

    return new Promise((resolve, reject) => {
        if(typeof command.validation === 'function')    {
            const valid = command.validation(message);
            if(typeof valid.then === 'function' && typeof valid.catch === 'function')   {
                return valid.then(res => res ? resolve(command.func) : reject()).catch(reject);
            }   else {
                return valid ? resolve(command.func) : reject();
            }
        }   else {
            resolve(command.func);
        }
    }).then(func => {
        console.log(func);
    })
}

module.exports = Command;

class CommandOperator   {

    constructor(message)    {
        this.msg = message;
    }

    isPrefixed()    {
        //
    }

    static fetchCommands()  {
        return new Promise(resolve => {
            const files = [];
            const walker = fsX.walk(__dirname + '/../commands');

            walker.on('data', (data) => {
                if(data.stats.isFile()) files.push(data.path);
            });
            walker.on('errors', console.error);
            walker.on('end', () => {
                resolve(files);
            });
        }).then(files => {
            const contents = new Map();
            for(const file of files)    {
                const mod = require(file);
                if(mod.disabled === false && (mod.disabled !== true || typeof mod.disabled !== 'undefined')) continue;

                if(mod.triggers && typeof mod.triggers[Symbol.iterator] === 'function' && typeof mod.triggers !== 'string' && !(mod.triggers instanceof RegExp))  {
                    for(const trigger of mod.triggers)  {
                        contents.set(trigger, {
                            func: mod.func,
                            validation: mod.validation
                        });
                    }
                }   else    {
                    contents.set(mod.triggers, {
                        func: mod.func,
                        validation: mod.validation
                    });
                }
            }
            return contents;
        }).then(console.log).catch(console.error);
    }
}