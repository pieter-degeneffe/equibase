import axios from "axios";
export default () => {
  return axios.create({
    baseURL: "http://localhost:8081",
    auth: {
        username: 'admin',
        password: 'Z3PtaWKwKzwFz2Yc6z9q8L7njdKJA@XTK'
    }
  });
};
