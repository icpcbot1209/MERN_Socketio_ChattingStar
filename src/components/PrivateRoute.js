import React from "react";
import { Route, Redirect } from "react-router-dom";

import * as Auth from "../modules/Auth";

export default class PrivateRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthed: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.check();
  }

  async check() {
    this.setState({ isLoading: true });

    let isAuthed = await Auth.checkAuth();
    if (isAuthed) {
      this.setState({
        isAuthed: true,
        isLoading: false,
      });
    } else {
      this.setState({ isAuthed: false, isLoading: false });
    }
  }

  render() {
    if (this.state.isLoading) return <div className="w3-black">loading</div>;

    return (
      <Route
        {...this.props.rest}
        render={({ location }) =>
          this.state.isAuthed ? (
            this.props.children
          ) : (
            <Redirect to={{ pathname: "/login" }} />
          )
        }
      />
    );
  }
}
