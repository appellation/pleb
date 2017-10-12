exports.user = (c, m) => {
  const pattern = /<@!?(1|\d{17,19})>/;
  return pattern.test(c) ? m.client.users.get(c.match(pattern)[1]) : null;
};
exports.integer = c => !c || isNaN(c) ? null : parseInt(c);
