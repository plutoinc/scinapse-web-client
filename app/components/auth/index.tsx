import * as React from "react";
import { Route, Switch } from "react-router-dom";
// components
import { Header, Footer } from '../layouts';
import Login from './login';
import SignIn from './signIn';

export default class AuthComponent extends React.PureComponent<null, null> {
  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/auth/login" component={Login} />
          <Route exact path="/auth/signIn" component={SignIn} />
        </Switch>
        <Footer />
      </div>
    )
  }
}
