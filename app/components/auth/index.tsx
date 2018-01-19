import * as React from "react";
import { connect } from "react-redux";
import { Switch, RouteComponentProps, Route } from "react-router-dom";
import { ICurrentUserRecord } from "../../model/currentUser";
import AuthRedirect, { AuthType } from "../../helpers/authRoute";
import SignIn from "./signIn";
import SignUp from "./signUp";
import EmailVerification from "./emailVerification";
import { IAppState } from "../../reducers";

interface IAuthComponentProps extends RouteComponentProps<any> {
  currentUser: ICurrentUserRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    currentUser: state.currentUser,
  };
}

class AuthComponent extends React.PureComponent<IAuthComponentProps, null> {
  public render() {
    const { match, currentUser } = this.props;
    const { isLoggedIn } = currentUser;

    return (
      <div>
        <Switch>
          <AuthRedirect
            path={`${match.url}/sign_in`}
            component={SignIn}
            isLoggedIn={isLoggedIn}
            needAuthType={AuthType.ShouldLoggedOut}
            exact
          />
          <AuthRedirect
            path={`${match.url}/sign_up`}
            component={SignUp}
            isLoggedIn={isLoggedIn}
            needAuthType={AuthType.ShouldLoggedOut}
            exact
          />
          <Route path={`${match.url}/email_verification`} component={EmailVerification} exact />
        </Switch>
      </div>
    );
  }
}

export default connect(mapStateToProps)(AuthComponent);
