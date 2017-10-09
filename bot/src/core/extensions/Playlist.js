const { Playlist } = require('discord.js-music');
const cassette = require('cassette');

const services = [
  new cassette.YouTubeService(process.env.youtube),
  new cassette.SoundcloudService(process.env.soundcloud),
];

const add = Playlist.prototype.add;
Playlist.prototype.add = async function(res, content, options) {
  res.send('adding songs to playlist...');

  const added = await add.call(this, content, services, options);

  if (added.length < 1) {
    res.error('Unable to find that resource.');
    return false;
  } else if (added.length === 1) {
    res.success(`added \`${added[0].title}\` to playlist`);
  } else {
    res.success(`added **${added.length}** songs to playlist`);
  }

  return true;
};

const start = Playlist.prototype.start;
Playlist.prototype.start = async function(response) {
  if (!this.current) return response.error('There is no song currently available to play.');

  await start.call(this, response.message.member.voiceChannel);
  return response.success(`now playing \`${this.current.title}\``);
};

