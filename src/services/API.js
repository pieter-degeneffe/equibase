import axios from "axios";
import { getAccessToken } from './auth';

export default () => {
  return axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${getAccessToken()}`
    }
  });
};
