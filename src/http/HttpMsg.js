import axios from "axios";
import * as Auth from "../modules/Auth";
import { server_url } from "../modules/common";

export const getMessages = async () => {
  let token = await Auth.getToken();
  return axios.get(`${server_url}/api/message`, { headers: { token: token } });
};

export const createMessage = async (content) => {
  let token = await Auth.getToken();
  return axios.post(
    `${server_url}/api/message`,
    { content },
    { headers: { token: token } }
  );
};
