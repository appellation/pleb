const request = require('axios');

exports.exec = async (cmd) => {
    const res = await request.get('http://api.pearson.com/v2/dictionaries/ldoce5/entries', {
        params: {
            headword: cmd.args.word
        }
    });

    let out = '';
    for (const detail of res.data.results) {
        out += '➡ ';

        if (detail.part_of_speech) {
            out += `\`${detail.part_of_speech}\` `;
        }
        out += `**${detail.headword}**`;

        if (detail.pronunciations)
            for (const pro of detail.pronunciations)
                out += ` / \`${pro.ipa}\``;

        out += '\n';

        if (detail.senses) {
            for (const sense of detail.senses) {

                if (sense.definition)
                    for (let i = 0; i < sense.definition.length; i++)
                        out += `\t${i+1}. *${sense.definition[i]}*\n`;

                if (sense.examples)
                    for (const ex of sense.examples)
                        out += `\tex: "${ex.text}"\n`;
            }
        }

        out += '\n';
    }

    return cmd.response.send(out);
};

exports.arguments = function* (Argument) {
    yield new Argument('word')
        .setPattern(/.*/)
        .setPrompt('What would you like to define?');
};
