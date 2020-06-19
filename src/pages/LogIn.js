import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import * as Auth from "../modules/Auth";
import LoadingOverlay from "react-loading-overlay";

export const LogIn = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [busy, setBusy] = useState(false);

  let history = useHistory();

  const tryLogIn = async () => {
    setBusy(true);
    let isAuthed = await Auth.tryLogIn(username, password);
    setBusy(false);
    if (isAuthed) {
      history.replace({ pathname: "/" });
    }
  };

  return (
    <LoadingOverlay active={busy} spinner text="Loading...">
      <div className="logo-container">
        <img src="/assets/img/logo512.png" className="App-logo" alt="logo" />
      </div>
      <video className="video-background" preload="auto" autoPlay loop muted>
        <source src="/assets/video/starfield.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      <div className="content-bottom">
        <h1>Chatting Star</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            tryLogIn();
          }}
        >
          <a className="btn-transp-round" href="/signup">
            +
          </a>

          <input
            type="text"
            className="input-transp"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="input-transp"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="btn-transp">
            Log In
          </button>
        </form>
      </div>
    </LoadingOverlay>
  );
};
