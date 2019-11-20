import axios from "axios";
import { getAccessToken } from './auth';

export default () => {
  return axios.create({
    baseURL: "http://localhost:8081",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`
    }
  });
};
