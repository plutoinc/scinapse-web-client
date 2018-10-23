import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { denormalize } from "normalizr";
import { Switch, RouteComponentProps, withRouter, Route } from "react-router-dom";
import { CurrentUser } from "../../model/currentUser";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import { profileSchema, Profile, Education, Experience, Award } from "../../model/profile";
import { ProfileShowState } from "./reducer";
import ProfileLeftBox from "../../components/profileLeftBox";
import ProfileNav from "../../components/profileNav";
import ProfilePublications from "../../components/profilePublications";
import { Paper, paperSchema } from "../../model/paper";
import { getProfilePublications } from "./actions";
import { getProfilePageData } from "./sideEffect";
import { Configuration } from "../../reducers/configuration";
import ProfileMeta, { ProfileMetaEnum } from "../../components/profileMeta";
import { addProfileMetaItem } from "../../actions/profile";
const styles = require("./profile.scss");

export interface ProfileShowMatchParams {
  profileId?: string;
}

interface ProfileContainerProps extends RouteComponentProps<ProfileShowMatchParams> {
  currentUser: CurrentUser;
  profile: Profile | null;
  configuration: Configuration;
  profileShow: ProfileShowState;
  papers: Paper[];
  dispatch: Dispatch<any>;
}

function mapStateToProps(state: AppState) {
  return {
    currentUser: state.currentUser,
    profileShow: state.profileShow,
    configuration: state.configuration,
    profile: denormalize(state.profileShow.profileId, profileSchema, state.entities),
    papers: denormalize(state.profileShow.paperIds, [paperSchema], state.entities),
  };
}

@withStyles<typeof ProfileContainer>(styles)
class ProfileContainer extends React.PureComponent<ProfileContainerProps> {
  public componentDidMount() {
    const { configuration, dispatch, match, location, profile } = this.props;

    const notRenderedAtServerOrJSAlreadyInitialized = !configuration.initialFetched || configuration.clientJSRendered;

    if (notRenderedAtServerOrJSAlreadyInitialized || !profile) {
      getProfilePageData({ dispatch, match, pathname: location.pathname });
    }
  }

  public render() {
    const { profile, profileShow, location, match, papers, currentUser, configuration } = this.props;

    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.leftBox}>
            <ProfileLeftBox profile={profile} />
          </div>
          <div className={styles.rightBox}>
            <ProfileNav location={location} profile={profile} />
            <Switch>
              <Route path={match.url} exact={true}>
                {this.getProfileContent()}
              </Route>
              <Route
                path={`${match.url}/publications`}
                render={() => (
                  <ProfilePublications
                    configuration={configuration}
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

  private getProfileContent = () => {
    const { profile, currentUser } = this.props;

    if (profile) {
      return (
        <ProfileMeta
          handleAddMetaItem={this.handleAddMetaItem}
          profile={profile}
          isMine={currentUser.profile_id === profile.id}
        />
      );
    }
    return null;
  };

  private handleAddMetaItem = (profileMetaType: ProfileMetaEnum, meta: Education | Experience | Award) => {
    const { dispatch, profile } = this.props;

    if (profile) {
      dispatch(
        addProfileMetaItem({
          profileId: profile.id,
          profileMetaType,
          meta,
        })
      );
    }
  };

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
