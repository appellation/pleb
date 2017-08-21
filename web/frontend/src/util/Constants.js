const CLIENT_ID = '218844420613734401';
const REDIRECT_URI = 'http://localhost:3000/auth/callback';

export const OAuth = {
  CLIENT_ID,
  REDIRECT_URI,
  AUTH_URL: `https://discordapp.com/api/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=identify`
};

export const Api = 'http://localhost:3000';
