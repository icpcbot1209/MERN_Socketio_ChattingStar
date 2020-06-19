import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./styles/App.scss";
import "./styles/Anime.scss";
import { LogIn } from "./pages/LogIn";
import { SignUp } from "./pages/SignUp";
import { Main } from "./pages/Main";

import PrivateRoute from "./components/PrivateRoute.js";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <LogIn />
        </Route>

        <Route path="/signup">
          <SignUp />
        </Route>

        <PrivateRoute path="/">
          <Main />
        </PrivateRoute>
      </Switch>
    </Router>
  );
}

export default App;
