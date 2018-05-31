import * as React from "react";
import { connect } from "react-redux";
import { Switch, RouteComponentProps, Route } from "react-router-dom";
import { CurrentUser } from "../../model/currentUser";
import AuthRedirect, { AuthType } from "../../helpers/authRoute";
import SignIn from "./signIn";
import SignUp from "./signUp";
import EmailVerification from "./emailVerification";
import { AppState } from "../../reducers";

interface AuthComponentProps extends RouteComponentProps<any> {
  currentUser: CurrentUser;
}

function mapStateToProps(state: AppState) {
  return {
    currentUser: state.currentUser,
  };
}

class AuthComponent extends React.PureComponent<AuthComponentProps, {}> {
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
            exact={true}
          />
          <AuthRedirect
            path={`${match.url}/sign_up`}
            component={SignUp}
            isLoggedIn={isLoggedIn}
            needAuthType={AuthType.ShouldLoggedOut}
            exact={true}
          />
          <Route path={`${match.url}/email_verification`} component={EmailVerification} exact={true} />
        </Switch>
      </div>
    );
  }
}

export default connect(mapStateToProps)(AuthComponent);
