import * as React from "react";
import { Route, Switch, RouteComponentProps, Redirect } from "react-router-dom";
import { connect } from "react-redux";
// components
import SignIn from "./signIn";
import SignUp from "./signUp";
import MyPage from "./myPage";
import Wallet from "./wallet";
import { ICurrentUserRecord, CURRENT_USER_INITIAL_STATE } from "../../model/currentUser";
import { IAppState } from "../../reducers/index";

interface IAuthComponentProps extends RouteComponentProps<any> {
  currentUser: ICurrentUserRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    currentUser: state.currentUser,
  };
}

class AuthComponent extends React.PureComponent<IAuthComponentProps, null> {
  render() {
    const { match, currentUser } = this.props;
    console.log(currentUser);
    return (
      <div>
        <Switch>
          <Route
            path={`${match.url}/sign_in`}
            render={props =>
              currentUser === CURRENT_USER_INITIAL_STATE ? (
                <SignIn />
              ) : (
                <Redirect
                  to={{
                    pathname: "/",
                    state: { from: props.location },
                  }}
                />
              )}
          />
          <Route
            path={`${match.url}/sign_up`}
            render={props =>
              currentUser === CURRENT_USER_INITIAL_STATE ? (
                <SignUp />
              ) : (
                <Redirect
                  to={{
                    pathname: "/",
                    state: { from: props.location },
                  }}
                />
              )}
          />
          <Route
            path={`${match.url}/wallet`}
            render={props =>
              currentUser !== CURRENT_USER_INITIAL_STATE ? (
                <Wallet />
              ) : (
                <Redirect
                  to={{
                    pathname: `${match.url}/sign_in`,
                    state: { from: props.location },
                  }}
                />
              )}
          />
          <Route
            path={`${match.url}/my_page`}
            render={props =>
              currentUser !== CURRENT_USER_INITIAL_STATE ? (
                <MyPage />
              ) : (
                <Redirect
                  to={{
                    pathname: `${match.url}/sign_in`,
                    state: { from: props.location },
                  }}
                />
              )}
          />
        </Switch>
      </div>
    );
  }
}

export default connect(mapStateToProps)(AuthComponent);
