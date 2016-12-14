/**
 * Created by Will on 10/20/2016.
 */

const rp = require('request-promise-native');
const fsX = require('fs-extra');
const fs = require('fs');

class CommandOperator   {

    constructor(message)    {
        this.msg = message;
        this.content = message.content;
    }

    trimPrefix()    {
        const prefixes = [
            `<@${process.env.discord_client_id}> `,
            `<!@${process.env.discord_client_id}> `
        ];

        for(const pref of prefixes) {
            console.log(pref);
            if(this.msg.content.startsWith(pref)) {
                return this.msg.content.substring(pref.length);
            }
        }
        return null;
    }

    get command()    {
        for(const cmd of commands.keys())  {
            if(cmd instanceof RegExp)   {
                if(this.content.match(cmd))  {
                    return commands.get(cmd);
                }
            }   else if(typeof cmd === 'string')    {
                if(this.content.startsWith(cmd)) {
                    return commands.get(cmd);
                }
            }
        }

        return null;
    }

    /**
     * Fetch all commands
     * @return {Promise.<Map>}
     */
    static fetchCommands()  {
        return new Promise(resolve => {
            const files = [];
            const walker = fsX.walk(__dirname + '/../commands');

            walker.on('data', (data) => {
                if(data.stats.isFile()) files.push(data.path);
            });
            walker.on('errors', console.error);
            walker.on('end', () => {
                return resolve(files);
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
        });
    }
}

const commands = CommandOperator.fetchCommands();

/**
 * @typedef {Object} CommandStructure
 * @property {Function} func
 * @property {Iterable|Object} triggers
 * @property {Function} [validation]
 * @property {[CommandStructure]} [options]
 */

function Command(message, body)   {
    const operator = new CommandOperator(message);

    const content = body || operator.trimPrefix();
    console.log(content);
    if(!content) return;
    operator.content = content;

    const command = operator.command;
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
    });
}

module.exports = Command;