/**
 * Created by nelso on 12/2/2016.
 */

/**
 * @return {string}
 */
function Link() {
    return 'https://discordapp.com/oauth2/authorize?client_id=218227587166502923&scope=bot&permissions=3173398';
}

module.exports = {
    func: Link,
    triggers: [
        'link',
        'invite'
    ]
};