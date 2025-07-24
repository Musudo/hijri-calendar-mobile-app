import axios from 'axios';

const baseURL = new URL('/', process.env.EXPO_PUBLIC_ALADHAN_API_URL);

export const fetchAladhanApi = axios.create({
  baseURL: baseURL.toString(),
});
