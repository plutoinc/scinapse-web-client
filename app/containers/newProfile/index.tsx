import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { CurrentUser } from "../../model/currentUser";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import ProfileWithoutData from "../../components/profileWithoutData";
import ProfileLeftBox from "../../components/profileLeftBox";
import ProfileNav from "../../components/profileNav";
import ProfileMeta from "../../components/profileMeta";
import ProfileSelectPaperList from "../../components/profileSelectPaperList/index";
import { postProfile } from "./actions";
import alertToast from "../../helpers/makePlutoToastAction";
import { ProfileNewState } from "./reducer";
import { Profile, profileSchema } from "../../model/profile";
import { denormalize } from "normalizr";
const styles = require("./newProfile.scss");

interface ProfileContainerProps extends RouteComponentProps<null> {
  dispatch: Dispatch<any>;
  currentUser: CurrentUser;
  profileNew: ProfileNewState;
  profile: Profile | null;
}

interface ProfileContainerStates
  extends Readonly<{
      step: number;
    }> {}

function mapStateToProps(state: AppState) {
  return {
    currentUser: state.currentUser,
    profileNew: state.profileNew,
    profile: denormalize(state.profileNew.profileId, profileSchema, state.entities),
  };
}

@withStyles<typeof ProfileContainer>(styles)
class ProfileContainer extends React.PureComponent<ProfileContainerProps, ProfileContainerStates> {
  public constructor(props: ProfileContainerProps) {
    super(props);

    this.state = {
      step: 0,
    };
  }

  public render() {
    const { currentUser } = this.props;

    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.leftBox}>
            <ProfileLeftBox member={currentUser} />
          </div>
          <div className={styles.rightBox}>{this.getRightBoxContent()}</div>
        </div>
      </div>
    );
  }

  private getRightBoxContent = () => {
    const { location, currentUser, profile } = this.props;
    const { step } = this.state;

    if (step === 1) {
      return <ProfileSelectPaperList handleClickConfirm={this.handlePostProfile} currentUser={currentUser} />;
    } else if (step === 2 && profile) {
      return (
        <div className={styles.rightBox}>
          <ProfileNav profile={profile} location={location} />
          <ProfileMeta profile={profile} />
        </div>
      );
    }

    // step 0
    return (
      <div>
        <ProfileNav location={location} profile={profile} />
        <ProfileWithoutData handleClickCreateProfile={this.handleClickNext} currentUser={currentUser} />
      </div>
    );
  };

  private handleClickNext = (step: number) => {
    this.setState(prevState => ({ ...prevState, step }));
  };

  private handlePostProfile = async (authorIds: number[]) => {
    const { dispatch } = this.props;

    try {
      await dispatch(postProfile(authorIds));
      this.handleClickNext(2);
    } catch (err) {
      alertToast(err);
    }
  };
}

export default withRouter(connect(mapStateToProps)(ProfileContainer));
