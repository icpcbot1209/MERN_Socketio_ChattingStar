import axios from "axios";
import * as Auth from "../modules/Auth";
import { server_url } from "../modules/common";

export const tryLogIn = (username, password) =>
  axios.post(`${server_url}/api/user/login`, { username, password });

export const trySignUp = (obj) =>
  axios.post(`${server_url}/api/user/signup`, { obj });

export const checkToken = (token) => {
  return axios.get(`${server_url}/api/user/checkToken`, {
    headers: { token: token },
  });
};

export const getOneByName = async (username) => {
  let token = await Auth.getToken();
  return axios.post(
    `${server_url}/api/user/getOneByName`,
    { username },
    { headers: { token: token } }
  );
};

export const getManyByName = async (arrName) => {
  let token = await Auth.getToken();
  return axios.post(
    `${server_url}/api/user/getManyByName`,
    { arrName },
    { headers: { token: token } }
  );
};
