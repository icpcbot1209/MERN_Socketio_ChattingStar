import axios from "axios";
import * as Auth from "../modules/Auth";
import { server_url } from "../modules/common";

export const getMine = async () => {
  let token = await Auth.getToken();
  return axios.get(`${server_url}/api/msgreco`, { headers: { token: token } });
};
