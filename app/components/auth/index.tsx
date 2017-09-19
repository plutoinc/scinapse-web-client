import * as React from "react";
import { Route, Switch, RouteComponentProps } from "react-router-dom";
// components
import SignIn from "./signIn";
import SignUp from "./signUp";
import Wallet from "./wallet";

interface IAuthComponentProps extends RouteComponentProps<any> {}

export default class AuthComponent extends React.PureComponent<IAuthComponentProps, null> {
  render() {
    const { match } = this.props;
    return (
      <div>
        <Switch>
          <Route path={`${match.url}/sign_in`} component={SignIn} />
          <Route path={`${match.url}/sign_up`} component={SignUp} />
          <Route path={`${match.url}/wallet`} children={Wallet} />
        </Switch>
      </div>
    );
  }
}
