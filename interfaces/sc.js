/**
 * Created by Will on 9/7/2016.
 */
(function() {

    const URL = require('url');
    const validURL = require('valid-url');
    const rp = require('request-promise-native');
    const _ = require('underscore');

    const StreamStructure = require('../structures/stream');

    const regex = /[a-zA-Z0-9-_]+/;

    class SCPlaylist    {

        constructor(list)   {
            this.list = list;
        }

        /**
         * Check if a URL is a SoundCloud URL.
         * @static
         * @param {string} urlIn
         * @returns {boolean} - Whether it's a SoundCloud URL
         */
        static isSoundCloudURL(urlIn)   {
            if(!validURL.is_web_uri(urlIn)) {
                return false;
            }

            const parsed = URL.parse(urlIn);

            if(parsed.host === 'www.soundcloud.com' || parsed.host === 'soundcloud.com')    {
                const params = parsed.pathname.split('/').slice(1);

                if(params[1] === 'sets')    {
                    return (params[0].match(regex) !== null && params[2].match(regex) !== null && params.length === 3);
                }   else    {
                    return (params[0].match(regex) !== null && params[1].match(regex) !== null && params.length === 2);
                }
            }

            return false;
        }

        static isSoundCloudStream(urlIn)    {
            return urlIn.match(/https?:\/\/api\.soundcloud\.com\/tracks\/[0-9]+\/stream/) !== null;
        }

        /**
         * Add a SoundCloud URL
         * @param urlIn - URL to add.
         * @returns {Promise} - Whether the addition was successful.
         */
        add(urlIn) {
            const self = this;

            const parsed = URL.parse(urlIn);
            const params = parsed.pathname.split('/').slice(1);

            return new Promise(function(resolve, reject)    {
                if(!SCPlaylist.isSoundCloudURL(urlIn)) {
                    reject();
                }

                const options = {
                    uri: 'https://api.soundcloud.com/resolve',
                    qs: {
                        url: urlIn,
                        client_id: process.env.soundcloud
                    },
                    json: true,
                    followAllRedirects: true
                };

                const req = rp(options);

                req.then(function(resource)  {
                    if(resource.kind === 'playlist')    {
                        _.each(resource.tracks, function(elem)  {
                            if(elem.streamable) {
                                self.list.add(new StreamStructure(elem.stream_url, elem.title, true));
                            }
                        });
                    }   else if(resource.kind === 'track' && resource.streamable)  {
                        self.list.add(new StreamStructure(resource.stream_url, resource.title, true));
                    }   else    {
                        reject();
                        return;
                    }

                    resolve(self.list);
                }).catch(function(err)  {
                    console.error(err);
                    reject();
                })
            });

        }
    }

    module.exports = SCPlaylist;
})();