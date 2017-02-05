/**
 * Created by Will on 11/11/2016.
 */

const rp = require('request-promise-native');

exports.func = (response, msg, args) => {
    return rp.get({
        uri: 'http://api.pearson.com/v2/dictionaries/ldoce5/entries',
        qs: {
            headword: args.join(' ')
        },
        json: true
    }).then(res => {
        let out = '';
        for(const detail of res.results)    {
            out += ':arrow_right: ';

            if(detail.part_of_speech)   {
                out += '`' + detail.part_of_speech + '` ';
            }
            out += `**${detail.headword}**`;

            if(detail.pronunciations)   {
                for(const pro of detail.pronunciations)    {
                    out += ' / `' + pro.ipa + '`';
                }
            }

            out += '\n';

            if(detail.senses)   {
                for(const sense of detail.senses)   {

                    if(sense.definition)    {

                        for(let i = 0; i < sense.definition.length; i++)  {
                            out += `\t${i+1}. *${sense.definition[i]}*\n`;
                        }
                    }

                    if(sense.examples)  {

                        for(const ex of sense.examples) {
                            out += `\tex: "${ex.text}"\n`;
                        }
                    }
                }
            }

            out += '\n';
        }

        return response.send(out);
    });
};

exports.validator = val => val.ensureArgs();