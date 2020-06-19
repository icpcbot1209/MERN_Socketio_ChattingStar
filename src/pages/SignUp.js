import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import CountrySeletor from "../components/CountrySeletor";
import ReCAPTCHA from "react-google-recaptcha";
import { Avatar } from "../components/Avatar";
import * as Auth from "../modules/Auth";

export const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("US");
  const [gender, setGender] = useState(0);
  const [age, setAge] = useState(25);
  const [imgUrl, setImgUrl] = useState("");
  let history = useHistory();

  const onSubmitForm = async (event) => {
    event.preventDefault();
    const recaptchaValue = recaptchaRef.current.getValue();
    // if (!recaptchaValue) return alert("Verify you are not a robot, please.");
    let obj = { username, password, country, gender, age, imgUrl };
    let isAuthed = await Auth.trySignUp(obj);
    if (isAuthed) {
      history.replace({ pathname: "/" });
    }
  };

  const recaptchaRef = useRef();

  return (
    <form className="container" onSubmit={onSubmitForm}>
      <div className="row">
        <div className="col">
          <Avatar handleChange={(url) => setImgUrl(url)} />

          <div className="mt-3">
            <div>Username</div>
            <input
              type="text"
              className="input-transp"
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <div>Password</div>
            <input
              type="password"
              className="input-transp"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <CountrySeletor
              value={country}
              onChange={(country) => setCountry(country)}
            />
          </div>
          <div className="mt-3">
            <div style={{ display: "inline-block" }}>
              <div>Age</div>
              <input
                type="number"
                className="input-transp-sm"
                placeholder="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div style={{ display: "inline-block", marginLeft: "10px" }}>
              <div>Gender</div>
              <select
                className="input-transp-sm w3-black"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value={0}>Male</option>
                <option value={1}>Female</option>
                <option value={2}>Other</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <ReCAPTCHA
              sitekey="6LcyhucUAAAAAKyGU-pG8fvZPM3ic9Iev4uSZgbi"
              ref={recaptchaRef}
              theme="dark"
            />
          </div>

          <div className="mt-5">
            <button type="submit" className="btn-transp">
              Sign up
            </button>
          </div>
        </div>

        <div className="col">
          <h1 className="w3-center">HELP</h1>
        </div>
      </div>
    </form>
  );
};
