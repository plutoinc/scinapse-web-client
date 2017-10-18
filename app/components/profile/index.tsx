import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Link, Switch, Route, RouteComponentProps } from "react-router-dom";
import { IAppState } from "../../reducers";
import Icon from "../../icons";
import * as Actions from "./actions";
import { IProfileStateRecord } from "./records";
import { ICurrentUserRecord } from "../../model/currentUser";
// Components
import Wallet from "./components/wallet";
import Setting from "./components/setting";
import { push } from "react-router-redux";
// Styles
const styles = require("./profile.scss");

interface IProfilePageParams {
  userId: string;
}

interface IProfileContainerProps
  extends DispatchProp<IProfileContainerMappedState>,
    RouteComponentProps<IProfilePageParams> {
  profileState: IProfileStateRecord;
  currentUserState: ICurrentUserRecord;
}

interface IProfileContainerMappedState {
  profileState: IProfileStateRecord;
  currentUserState: ICurrentUserRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    profileState: state.profile,
    currentUserState: state.currentUser,
  };
}

const mockInstitution = "Postech";
const mockMajor = "Creative Interesting Technology Engineer";
const mockArticleNum = 3;
const mockEvaluationNum = 10;

const mockTokenBalance = 3;
const mockWalletAddress = "0x822408EAC8C331002BE00070AFDD2A5A02065D3F";

class ProfileContainer extends React.PureComponent<IProfileContainerProps, {}> {
  public componentDidMount() {
    const { match } = this.props;
    const paramUserId = match.params.userId;

    this.updateProfileUser(paramUserId);
  }

  public componentWillReceiveProps(nextProps: IProfileContainerProps) {
    const beforeParamUserId = this.props.match.params.userId;
    const nextParamUserId = nextProps.match.params.userId;

    if (beforeParamUserId !== nextParamUserId) {
      this.updateProfileUser(nextParamUserId);
    }
  }

  private updateProfileUser(paramUserId: string) {
    const { dispatch, currentUserState } = this.props;
    const { profileImage, institution, major } = currentUserState;
    const currentUserStateId = currentUserState.id;

    if (currentUserStateId === parseInt(paramUserId, 10)) {
      dispatch(Actions.syncSettingInputWithCurrentUser(profileImage, institution, major));
      dispatch(Actions.syncCurrentUserWithProfileUser(currentUserState));
    } else {
      dispatch(Actions.getUserProfile(paramUserId));
    }
  }

  private changeProfileImageInput = (profileImageInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeProfileImageInput(profileImageInput));
  };

  private updateCurrentUserProfileImage = (profileImageInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.updateCurrentUserProfileImage(profileImageInput));
  };

  private changeInstitutionInput = (institutionInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeInstitutionInput(institutionInput));
  };

  private updateCurrentUserInstitution = (institutionInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.updateCurrentUserInstitution(institutionInput));
  };

  private changeMajorInput = (majorInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeMajorInput(majorInput));
  };

  private updateCurrentUserMajor = (majorInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.updateCurrentUserMajor(majorInput));
  };

  private getCategoryBtn = (path: string, content: string) => {
    const currentPathname = this.props.location.pathname;

    return (
      <Link
        to={path}
        className={path === currentPathname ? `${styles.categoryBtn} ${styles.isClickedBtn}` : styles.categoryBtn}
      >
        {content}
      </Link>
    );
  };

  private getSettingButton = () => {
    const { currentUserState, match } = this.props;
    if (currentUserState.isLoggedIn && currentUserState.id === parseInt(match.params.userId, 10)) {
      return this.getCategoryBtn(`/users/${match.params.userId}/setting`, "Setting");
    } else {
      return null;
    }
  };

  private getMyProfileBtns = () => {
    const paramUserId = this.props.match.params.userId;
    const { isLoggedIn, id } = this.props.currentUserState;

    if (isLoggedIn && id === parseInt(paramUserId, 10)) {
      return (
        <div className={styles.myProfileBtns}>
          <Link to={`/users/${id}/setting`} className={styles.configureIconWrapper}>
            <Icon icon="SETTING_BUTTON" />
          </Link>
          <Link to="/articles/new" className={styles.submitArticleBtn}>
            Submit Article
          </Link>
        </div>
      );
    }
  };

  private getUpperContainer = () => {
    const { profileState, match } = this.props;
    const { name, reputation } = profileState.userProfile;

    const paramUserId = match.params.userId;

    return (
      <div className={styles.upperContainer}>
        <div className={styles.profileContainer}>
          <Icon className={styles.avatarIconWrapper} icon="AVATAR" />
          <div className={styles.profileDescription}>
            <div className={styles.nameAndReputation}>
              <div className={styles.userName}>{name}</div>
              <div className={styles.reputationGraphIconWrapper}>
                <Icon icon="REPUTATION_GRAPH" />
              </div>
              <div className={styles.reputation}>
                <div className={styles.reputationTooltip}>
                  <div className={styles.reputationTooltipIconWrapper}>
                    <Icon icon="TOOLTIP" />
                  </div>
                  <div className={styles.reputationTooltipContent}>Reputation</div>
                </div>
                {reputation}
              </div>
            </div>
            <div className={styles.userDegree}>{`${mockInstitution}, ${mockMajor}`}</div>
            <div className={styles.userHistory}>
              {`Article  ${mockArticleNum}  |   Evaluation  ${mockEvaluationNum} `}
            </div>
          </div>
          {this.getMyProfileBtns()}
        </div>
        <div className={styles.categoryContainer}>
          {this.getCategoryBtn(`/users/${paramUserId}`, "Article")}
          {this.getCategoryBtn(`/users/${paramUserId}/evaluation`, "Evaluation")}
          {this.getCategoryBtn(`/users/${paramUserId}/wallet`, "Wallet")}
          {this.getSettingButton()}
        </div>
        <div className={styles.separatorLine} />
      </div>
    );
  };

  private handlePassInvalidUser = () => {
    this.props.dispatch(push("/"));
  };

  public render() {
    const { currentUserState, profileState, match } = this.props;
    const { profileImage, institution, major } = currentUserState;
    const { profileImageInput, institutionInput, majorInput } = profileState;

    return (
      <div>
        {this.getUpperContainer()}
        <div className={styles.lowerContainer}>
          <Switch>
            <Route exact path={`${match.url}/wallet`}>
              <Wallet tokenBalance={mockTokenBalance} walletAddress={mockWalletAddress} />
            </Route>
            <Route exact path={`${match.url}/evaluation`} children={<div>evaluation</div>} />
            <Route exact path={`${match.url}/setting`}>
              <Setting
                handlePassInvalidUser={this.handlePassInvalidUser}
                isValidUser={currentUserState.isLoggedIn && currentUserState.id === parseInt(match.params.userId, 10)}
                previousProfileImage={profileImage}
                profileImageInput={profileImageInput}
                changeProfileImageInput={this.changeProfileImageInput}
                updateCurrentUserProfileImage={this.updateCurrentUserProfileImage}
                previousInstitution={institution}
                institutionInput={institutionInput}
                changeInstitutionInput={this.changeInstitutionInput}
                updateCurrentUserInstitution={this.updateCurrentUserInstitution}
                previousMajor={major}
                majorInput={majorInput}
                changeMajorInput={this.changeMajorInput}
                updateCurrentUserMajor={this.updateCurrentUserMajor}
              />
            </Route>
            <Route children={<div>Article</div>} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ProfileContainer);
