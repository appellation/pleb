const Spectacles = require('spectacles.js')('discord.js');

class SpectaclesIntegration extends Spectacles {
  constructor(bot) {
    super(bot.client, {
      host: 'redis',
      retry_strategy: (options) => {
        if (options.total_retry_time > 1000 * 60 * 60) {
          return new Error('Retry time exhausted.');
        }

        return Math.min(options.attempt * 100, 3000);
      }
    });
    this.bot = bot;
  }

  getCommand(name) {
    return SpectaclesIntegration.formatCommand(this.bot.handler.loader.commands.get(name));
  }

  getCommands() {
    const out = new Map();
    for (const [key, cmd] of this.bot.handler.loader.commands) out.set(key, SpectaclesIntegration.formatCommand(cmd));
    return out;
  }

  static formatCommand(command) {
    return {
      name: command.name,
      description: command.description,
      aliases: command.triggers
    };
  }
}

module.exports = SpectaclesIntegration;
