import axios from "axios";
import * as Auth from "../modules/Auth";
import { server_url } from "../modules/common";

export const getMap = async () => {
  let token = await Auth.getToken();
  return axios.get(`${server_url}/api/star/map`, { headers: { token: token } });
};

export const getXY = async (idSocket) => {
  let token = await Auth.getToken();
  return axios.post(
    `${server_url}/api/star/getXY`,
    { idSocket },
    { headers: { token: token } }
  );
};

export const getArrMsg = async (idSocket) => {
  let token = await Auth.getToken();
  return axios.post(
    `${server_url}/api/star/getArrMsg`,
    { idSocket },
    { headers: { token: token } }
  );
};
