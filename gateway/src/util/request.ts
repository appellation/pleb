import axios, { AxiosInstance } from 'axios';

export default axios.create({
  baseURL: 'https://discordapp.com/api/v6/',
  headers: { Authorization: process.env.discord }
});
