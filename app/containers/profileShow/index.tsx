import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { denormalize } from "normalizr";
import { Switch, RouteComponentProps, withRouter, Route } from "react-router-dom";
import { CurrentUser } from "../../model/currentUser";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import { profileSchema, Profile } from "../../model/profile";
import { ProfileShowState } from "./reducer";
import ProfileLeftBox from "../../components/profileLeftBox";
import ProfileNav from "../../components/profileNav";
import ProfilePublications from "../../components/profilePublications";
import { Paper, paperSchema } from "../../model/paper";
import { getProfilePublications } from "./actions";
const styles = require("./profile.scss");

export interface ProfileShowMatchParams {
  profileId?: string;
}

interface ProfileContainerProps extends RouteComponentProps<ProfileShowMatchParams> {
  currentUser: CurrentUser;
  profile: Profile;
  profileShow: ProfileShowState;
  papers: Paper[];
  dispatch: Dispatch<any>;
}

function mapStateToProps(state: AppState) {
  return {
    currentUser: state.currentUser,
    profileShow: state.profileShow,
    profile: denormalize(state.profileShow.profileId, profileSchema, state.entities),
    papers: denormalize(state.profileShow.paperIds, [paperSchema], state.entities),
  };
}

@withStyles<typeof ProfileContainer>(styles)
class ProfileContainer extends React.PureComponent<ProfileContainerProps> {
  public render() {
    const { profile, profileShow, location, match, papers, currentUser } = this.props;

    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.leftBox}>
            <ProfileLeftBox profile={profile} />
          </div>
          <div className={styles.rightBox}>
            <ProfileNav location={location} />
            <Switch>
              <Route
                path={`${match.url}/publications`}
                render={() => (
                  <ProfilePublications
                    profileShow={profileShow}
                    currentUser={currentUser}
                    papers={papers}
                    location={location}
                    fetchPapers={this.fetchPapers}
                  />
                )}
                exact={true}
              />
            </Switch>
          </div>
        </div>
      </div>
    );
  }

  private fetchPapers = (page: number) => {
    const { dispatch, profileShow } = this.props;

    dispatch(
      getProfilePublications({
        profileId: profileShow.profileId,
        size: 10,
        page,
      })
    );
  };
}

export default withRouter(connect(mapStateToProps)(ProfileContainer));
