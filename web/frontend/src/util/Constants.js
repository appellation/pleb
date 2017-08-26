const CLIENT_ID = '218844420613734401';
const REDIRECT_URI = 'http://localhost:3000/auth/callback';

export const OAuth = {
  CLIENT_ID,
  REDIRECT_URI,
  AUTH_URL: (id) => encodeURI(`https://discordapp.com/api/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=bot+identify&state=${id}`)
};

export const Api = 'http://localhost:3000';
