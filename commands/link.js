/**
 * Created by nelso on 12/2/2016.
 */

/**
 * @return {string}
 */
function Link() {
    return 'https://discordapp.com/oauth2/authorize?permissions=3197952&scope=bot&client_id=218227587166502923';
}

module.exports = {
    func: Link,
    triggers: [
        'link',
        'invite'
    ]
};