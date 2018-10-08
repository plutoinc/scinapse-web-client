import * as React from "react";
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import { Switch, RouteComponentProps, Route } from "react-router-dom";
import { CurrentUser } from "../../model/currentUser";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import ProfileWithoutData from "../../components/profileWithoutData";
import { profileSchema, Profile } from "../../model/profile";
import { ProfileShowState } from "./reducer";
import ProfileLeftBox from "../../components/profileLeftBox";
const styles = require("./profile.scss");

export interface ProfileShowMatchParams {
  profileId: string;
}

interface ProfileContainerProps extends RouteComponentProps<ProfileShowMatchParams> {
  currentUser: CurrentUser;
  profile: Profile;
  profileShow: ProfileShowState;
}

function mapStateToProps(state: AppState) {
  return {
    currentUser: state.currentUser,
    profileShow: state.profileShow,
    profile: denormalize(state.profileShow.profileId, profileSchema, state.entities),
  };
}

@withStyles<typeof ProfileContainer>(styles)
class ProfileContainer extends React.PureComponent<ProfileContainerProps> {
  // public componentDidMount() {

  // }

  public render() {
    const { match } = this.props;

    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.leftBox}>
            <ProfileLeftBox />
          </div>
          <div className={styles.rightBox}>
            <Switch>
              {/* <AuthRedirect
              path={`${match.url}/sign_in`}
              component={ProfileWithoutData}
              isLoggedIn={isLoggedIn}
              needAuthType={AuthType.ShouldLoggedOut}
              exact={true}
            /> */}
              <Route path={`${match.url}`} component={ProfileWithoutData} exact={true} /> */}
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ProfileContainer);
