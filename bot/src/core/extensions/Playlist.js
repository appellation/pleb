const { Playlist, Error } = require('discord.js-music');
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

  try {
    await start.call(this, response.message.member.voiceChannel);
  } catch (e) {
    if (e instanceof Error) {
      switch (e.code) {
        case 0: return response.error('You\'re not in a voice channel.');
        case 1: return response.error('I can\'t join your voice channel.');
        case 2: return response.error('I can\'t speak in your voice channel');
        case 3: return response.error('uh oh, I\'m not connected to a voice channel for some reason.');
        case 4: return response.error('uh oh, the current song doesn\'t exist for some reason.');
        default: return response.error(`the playlist dun fuked up: \`${e}\``);
      }
    }
    return response.error(e.message || e);
  }
  return response.success(`now playing \`${this.current.title}\``);
};

