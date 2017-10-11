import * as React from "react";
import { Switch, RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
// components
import SignIn from "./signIn";
import SignUp from "./signUp";
import MyPage from "./myPage";
import Wallet from "./wallet";
import { ICurrentUserRecord } from "../../model/currentUser";
import { IAppState } from "../../reducers";
import AuthRedirect from "../../helpers/authRoute";

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
    const { isLoggedIn } = currentUser;

    return (
      <div>
        <Switch>
          <AuthRedirect
            path={`${match.url}/sign_in`}
            Component={SignIn}
            isLoggedIn={isLoggedIn}
            shouldLoggedIn={false}
          />
          <AuthRedirect
            path={`${match.url}/sign_up`}
            Component={SignUp}
            isLoggedIn={isLoggedIn}
            shouldLoggedIn={false}
          />
          <AuthRedirect path={`${match.url}/wallet`} children={Wallet} isLoggedIn={isLoggedIn} shouldLoggedIn={true} />
          <AuthRedirect
            path={`${match.url}/my_page`}
            Component={MyPage}
            isLoggedIn={isLoggedIn}
            shouldLoggedIn={true}
          />
        </Switch>
      </div>
    );
  }
}

export default connect(mapStateToProps)(AuthComponent);
