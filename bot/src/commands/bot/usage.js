const { Command } = require('discord-handles');

module.exports = class extends Command {
  async exec() {
    const r = this.client.bot.db.r;
    const table = r.table('usage');

    const totals = {
      allTime: await table.count(),
      lastHour: await table.filter(r.row('timestamp').gt(r.now().sub(60*60))).count()
    };

    const data = {
      allTime: await table.group('name').count().ungroup().orderBy(r.desc(r.row('reduction'))).limit(10),
      lastHour: await table.filter(r.row('timestamp').gt(r.now().sub(60*60))).group('name').count().ungroup().orderBy(r.desc(r.row('reduction'))).limit(10),
    };

    return this.response.send(`__**Usage information**__

**All-time:** \`${totals.allTime}\`
**Last hour:** \`${totals.lastHour}\`

__Commands (all-time)__
${data.allTime.map(d => `${d.group}: ${d.reduction}`).join('\n')}

__Commands (last hour)__
${data.lastHour.map(d => `${d.group}: ${d.reduction}`).join('\n')}
`);
  }
};
