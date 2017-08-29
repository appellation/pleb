const CLIENT_ID = '218844420613734401';
const REDIRECT_URI = 'http://localhost:3000/auth/callback';

export const OAuth = {
  CLIENT_ID,
  REDIRECT_URI,
  AUTH_URL: (id) => encodeURI(`http://localhost:3000/auth/login?session=${id}`)
};

export const Api = 'http://localhost:3000';
