import * as React from "react";
import { Route, Switch, match } from "react-router-dom";
// components
import { Header, Footer } from '../layouts';
import Login from './login';
import SignIn from './signIn';

interface IAuthComponentProps {
  match: match<object>;
}

export default class AuthComponent extends React.PureComponent<IAuthComponentProps, null> {
render() {
  const { match } = this.props;
  return (
    <div>
      <Header />
      <Switch>
        <Route path={`${match.url}/login`} component={Login} />
        <Route path={`${match.url}/signin`} component={SignIn} />
      </Switch>
      <Footer />
    </div>
  )
  }
}
