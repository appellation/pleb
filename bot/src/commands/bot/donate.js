const { Command } = require('discord-handles');

module.exports = class extends Command {
  exec() {
    return this.response.send('<https://patreon.com/appellation>\n\nSpecial thanks to:\n- **Moofy#9177**\n- **ItsJojj#6161**\n- **Nomsy#7453**');
  }
};
