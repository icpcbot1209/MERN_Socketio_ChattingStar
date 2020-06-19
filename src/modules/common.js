import io from "socket.io-client";
import * as HttpUser from "../http/HttpUser";

export const server_url = "http://localhost:8080";

let socket = null;
export const getSocket = () => {
  if (socket == null) socket = io(`${server_url}/star-move`);
  return socket;
};

let dicUser = {};
export const getDicUser = () => {
  return dicUser;
};

export const updateDicUser = async (arrOne) => {
  for (let i = 0; i < arrOne.length; i++) {
    let username = arrOne[i].username;
    if (dicUser[username]) continue;
    let resp = await HttpUser.getOneByName(username);
    let { user } = resp.data;
    dicUser[username] = user;
  }
};

let me = {};
let arrMate = [];
export const setMe = (_me) => {
  me = _me;
};

export const setArrMate = (_arrMate) => {
  arrMate = _arrMate;
};

export const findInRoom = (username) => {
  if (me.username == username) return me;
  let k = arrMate.findIndex((mate) => mate.username == username);
  if (k > -1) return arrMate[k];
  return null;
};
