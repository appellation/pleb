const { Command } = require('discord-handles');
const Sequelize = require('sequelize');

module.exports = class extends Command {
  async exec() {
    const model = this.client.db.models.usage;

    const totals = {
      allTime: await model.count(),
      lastHour: await model.count({ where: { createdAt: { $gt: Date.now() - 3.6e6 } } }),
    };

    const data = {
      allTime: await model.findAll({
        limit: 10,
        order: [['count', 'DESC']],
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('command')), 'count'], 'command'],
        group: ['command']
      }),
      lastHour: await model.findAll({
        where: { createdAt: { $gt: Date.now() - 3.6e6 } },
        limit: 10,
        order: [['count', 'DESC']],
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('command')), 'count'], 'command'],
        group: ['command']
      }),
    };

    return this.response.send(`__**Usage information**__

**All-time:** \`${totals.allTime}\`
**Last hour:** \`${totals.lastHour}\`

__Commands (all-time)__
${data.allTime.map(d => `${d.get('command')}: ${d.get('count')}`).join('\n')}

__Commands (last hour)__
${data.lastHour.map(d => `${d.get('command')}: ${d.get('count')}`).join('\n')}
`);
  }
};
