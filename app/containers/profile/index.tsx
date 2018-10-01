import * as React from "react";
import { connect } from "react-redux";
import { Switch, RouteComponentProps, Route } from "react-router-dom";
import { CurrentUser } from "../../model/currentUser";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import ProfileWithoutData from "../../components/profileWithoutData";
const styles = require("./profile.scss");

interface ProfileContainerProps extends RouteComponentProps<any> {
  currentUser: CurrentUser;
}

function mapStateToProps(state: AppState) {
  return {
    currentUser: state.currentUser,
  };
}

@withStyles<typeof ProfileContainer>(styles)
class ProfileContainer extends React.PureComponent<ProfileContainerProps, {}> {
  public render() {
    const { match } = this.props;

    return (
      <div className={styles.pageWrapper}>
        <div className={styles.authWrapper}>
          <Switch>
            {/* <AuthRedirect
              path={`${match.url}/sign_in`}
              component={ProfileWithoutData}
              isLoggedIn={isLoggedIn}
              needAuthType={AuthType.ShouldLoggedOut}
              exact={true}
            /> */}
            {/* {/* <Route path={`${match.url}/reset-password`} component={ResetPassword} exact={true} /> */}
            <Route path={`${match.url}`} component={ProfileWithoutData} exact={true} /> */}
          </Switch>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ProfileContainer);
