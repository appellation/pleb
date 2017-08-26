export function auth(to, from, next) {
  if (!this.$auth.loggedIn) next(false);
  else next();
}
