import * as HttpUser from "../http/HttpUser";

const tokenAddr = "token_chattingstar";

export const getToken = async () => {
  let token = await localStorage.getItem(tokenAddr);
  return token;
};

export const tryLogIn = async (username, password) => {
  try {
    let resp = await HttpUser.tryLogIn(username, password);
    let token = resp.data.token;
    await localStorage.setItem(tokenAddr, token);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const trySignUp = async (obj) => {
  try {
    let resp = await HttpUser.trySignUp(obj);
    let token = resp.data.token;
    await localStorage.setItem(tokenAddr, token);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const doLogOut = async () => {
  await localStorage.removeItem(tokenAddr);
};

export const checkAuth = async () => {
  try {
    let token = await localStorage.getItem(tokenAddr);
    if (token) {
      let resp = await HttpUser.checkToken(token);
      username = resp.data.username;
      return true;
    }
  } catch (err) {
    console.log(err);
  }
  return false;
};

export let username = null;
