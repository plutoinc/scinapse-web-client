import * as React from "react";
import { connect } from "react-redux";
import { Switch, RouteComponentProps, Route } from "react-router-dom";
import { CurrentUser } from "../../model/currentUser";
import AuthRedirect, { AuthType } from "../../helpers/authRoute";
import SignIn from "./signIn";
import SignUp from "./signUp";
import ResetPassword from "./resetPassword";
import EmailVerification from "./emailVerification";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
const styles = require("./auth.scss");

interface AuthComponentProps extends RouteComponentProps<any> {
  currentUser: CurrentUser;
}

function mapStateToProps(state: AppState) {
  return {
    currentUser: state.currentUser,
  };
}

@withStyles<typeof AuthComponent>(styles)
class AuthComponent extends React.PureComponent<AuthComponentProps, {}> {
  public render() {
    const { match, currentUser } = this.props;
    const { isLoggedIn } = currentUser;

    return (
      <div className={styles.pageWrapper}>
        <div className={styles.authWrapper}>
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
            <Route path={`${match.url}/reset-password`} component={ResetPassword} exact={true} />
            <Route path={`${match.url}/email_verification`} component={EmailVerification} exact={true} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(AuthComponent);
