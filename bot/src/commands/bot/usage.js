const Sequelize = require('sequelize');

exports.exec = async cmd => {
  const model = cmd.client.bot.provider.models.Usage;

  const totals = {
    allTime: await model.count(),
    lastHour: await model.count({ where: { createdAt: { $gt: Date.now() - 3.6e6 } } })
  };

  const data = {
    allTime: await model.findAll({
      limit: 10,
      order: [['count', 'DESC']],
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('name')), 'count'], 'name'],
      group: ['name']
    }),
    lastHour: await model.findAll({
      where: { createdAt: { $gt: Date.now() - 3.6e6 } },
      limit: 10,
      order: [['count', 'DESC']],
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('name')), 'count'], 'name'],
      group: ['name']
    })
  };

  return cmd.response.send(`__**Usage information**__

**All-time:** \`${totals.allTime}\`
**Last hour:** \`${totals.lastHour}\`

__Commands (all-time)__
${data.allTime.map(instance => `${instance.get('name')}: ${instance.get('count')}`).join('\n')}

__Commands (last hour)__
${data.lastHour.map(instance => `${instance.get('name')}: ${instance.get('count')}`).join('\n')}
`);
};
