import React from "react";
import { useHistory } from "react-router-dom";
import * as Auth from "../modules/Auth";

export const AuthButton = () => {
  let history = useHistory();

  const doLogOut = async () => {
    await Auth.doLogOut();
    history.replace({ pathname: "/login" });
  };

  return (
    <div>
      <strong>{Auth.username}</strong>
      <button className="btn btn-warning ml-3" onClick={(e) => doLogOut()}>
        <i className="fa fa-user mr-1" /> <i className="fa fa-sign-out" />
      </button>
    </div>
  );
};
