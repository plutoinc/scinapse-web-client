import * as React from "react";
import { Route, Switch, match } from "react-router-dom";
// components
import SignIn from "./signIn";
import SignUp from "./signUp";

interface IAuthComponentProps {
  match: match<object>;
}

export default class AuthComponent extends React.PureComponent<
  IAuthComponentProps,
  null
> {
  render() {
    const { match } = this.props;
    return (
      <div>
        <Switch>
          <Route path={`${match.url}/sign_in`} component={SignIn} />
          <Route path={`${match.url}/sign_up`} component={SignUp} />
        </Switch>
      </div>
    );
  }
}
