import * as React from "react";
import axios, { CancelTokenSource } from "axios";
import { connect, DispatchProp } from "react-redux";
import { Link, Switch, Route, RouteComponentProps, withRouter } from "react-router-dom";
import { push } from "react-router-redux";
import { IAppState } from "../../reducers";
import Icon from "../../icons";
import * as Actions from "./actions";
import { IProfileStateRecord } from "./records";
import { ICurrentUserRecord } from "../../model/currentUser";
import Wallet from "./components/wallet";
import Setting from "./components/setting";
import UserArticles from "./components/article";
import ProfileEvaluations from "./components/evaluations";
import {
  getUserArticles,
  clearArticlesToShow,
  fetchEvaluations,
  clearEvaluationIdsToShow,
  IUpdateCurrentUserProfileParams,
} from "./actions";
import { IReviewsRecord } from "../../model/review";
import selectEvaluations from "./select";
import { getArticles } from "../articleFeed/actions";
import { IArticlesRecord } from "../../model/article";
import Tooltip from "../common/tooltip/tooltip";
import { FEED_SORTING_OPTIONS } from "../articleFeed/records";
import { votePeerReview } from "../articleShow/actions";
import UserProfileIcon from "../common/userProfileIcon";
// Styles
const styles = require("./profile.scss");

interface IProfilePageParams {
  userId: string;
}

interface IProfileContainerProps
  extends DispatchProp<IProfileContainerMappedState>,
    RouteComponentProps<IProfilePageParams> {
  articles: IArticlesRecord;
  profileState: IProfileStateRecord;
  currentUserState: ICurrentUserRecord;
  evaluations: IReviewsRecord;
}

interface IProfileContainerMappedState {
  articles: IArticlesRecord;
  profileState: IProfileStateRecord;
  currentUserState: ICurrentUserRecord;
  evaluations: IReviewsRecord;
}

function mapStateToProps(state: IAppState, props: IProfileContainerProps) {
  const { match } = props;
  const userId = parseInt(match.params.userId, 10);

  return {
    articles: state.articles,
    profileState: state.profile,
    currentUserState: state.currentUser,
    evaluations: selectEvaluations(state.evaluations, state.profile.evaluationIdsToShow, userId),
  };
}

const mockTokenBalance = 3;

@withRouter
class ProfileContainer extends React.PureComponent<IProfileContainerProps, {}> {
  private articleCancelTokenSource: CancelTokenSource;
  private articlesCancelTokenSource: CancelTokenSource;
  private evaluationCancelTokenSource: CancelTokenSource;

  private updateProfileUser = (paramUserId: string) => {
    const { dispatch, currentUserState } = this.props;
    const { profileImage, institution, major } = currentUserState;
    const currentUserStateId = currentUserState.id;

    if (currentUserStateId === parseInt(paramUserId, 10)) {
      dispatch(Actions.syncSettingInputWithCurrentUser(profileImage, institution, major));
      dispatch(Actions.syncCurrentUserWithProfileUser(currentUserState));
    } else {
      dispatch(Actions.getUserProfile(paramUserId));
    }
  };

  private fetchUserArticles = (userId: number) => {
    const { dispatch, profileState } = this.props;

    if (profileState.fetchingContentLoading) {
      return;
    } else {
      const CancelToken = axios.CancelToken;
      this.articleCancelTokenSource = CancelToken.source();

      dispatch(
        getUserArticles({
          userId,
          page: profileState.page,
          cancelTokenSource: this.articleCancelTokenSource,
        }),
      );
    }
  };

  private fetchUserEvaluations = async (userId: number) => {
    const { dispatch, profileState } = this.props;

    if (profileState.fetchingContentLoading) {
      return;
    } else {
      const CancelToken = axios.CancelToken;
      this.evaluationCancelTokenSource = CancelToken.source();

      const evaluations = await dispatch(
        fetchEvaluations({
          userId,
          page: profileState.evaluationListPage,
          cancelTokenSource: this.evaluationCancelTokenSource,
          sort: "createdAt,desc",
        }),
      );

      const targetArticleIds = evaluations.map(evaluation => evaluation.articleId).toArray();
      const ArticlesCancelToken = axios.CancelToken;
      this.articlesCancelTokenSource = ArticlesCancelToken.source();

      await dispatch(
        getArticles({
          size: evaluations.count(),
          ids: targetArticleIds,
          sort: FEED_SORTING_OPTIONS.LATEST,
          cancelTokenSource: this.articlesCancelTokenSource,
        }),
      );
    }
  };

  private cancelOnGoingEvaluationRequest = () => {
    if (this.articlesCancelTokenSource) {
      this.articlesCancelTokenSource.cancel("Request canceled");
    }
    this.evaluationCancelTokenSource.cancel("Request canceled");
  };

  private cancelOnGoingArticleRequest = () => {
    this.articleCancelTokenSource.cancel("Request canceled");
  };

  private changeProfileImageInput = (profileImageInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeProfileImageInput(profileImageInput));
  };

  private changeInstitutionInput = (institutionInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeInstitutionInput(institutionInput));
  };

  private changeMajorInput = (majorInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeMajorInput(majorInput));
  };

  private updateCurrentUserProfile = () => {
    const { dispatch, currentUserState, profileState } = this.props;
    const params: IUpdateCurrentUserProfileParams = {
      currentUserRecord: currentUserState,
      profileImage: profileState.profileImageInput,
      institution: profileState.institutionInput,
      major: profileState.majorInput,
    };

    dispatch(Actions.updateCurrentUserProfile(params));
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

  private getMyProfileButtons = () => {
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

  private getUserDegreeContent = (institution: string, major: string) => {
    let userDegreeContent = institution;
    if (major !== null && major !== "") {
      userDegreeContent = `${institution}, ${major}`;
    }
    return userDegreeContent;
  };

  private getUpperContainer = () => {
    const { profileState, match } = this.props;
    const {
      name,
      institution,
      major,
      reputation,
      profileImage,
      id,
      articleCount,
      evaluationCount,
    } = profileState.userProfile;

    const paramUserId = match.params.userId;

    return (
      <div className={styles.upperContainer}>
        <div className={styles.profileContainer}>
          <UserProfileIcon profileImage={profileImage} userId={id} type="middle" />
          <div className={styles.profileDescription}>
            <div className={styles.nameAndReputation}>
              <div className={styles.userName}>{name}</div>
              <div className={styles.reputationGraphIconWrapper}>
                <Icon icon="REPUTATION_GRAPH" />
              </div>
              <div className={styles.reputation}>
                <Tooltip
                  className={styles.reputationTooltip}
                  left={-24}
                  top={-26}
                  iconTop={-9}
                  content={"Reputation"}
                />
                {reputation}
              </div>
            </div>
            <div className={styles.userDegree}>{this.getUserDegreeContent(institution, major)}</div>
            <div className={styles.userHistory}>{`Article ${articleCount} | Review ${evaluationCount} `}</div>
          </div>
          {this.getMyProfileButtons()}
        </div>
        <div className={styles.categoryContainer}>
          {this.getCategoryBtn(`/users/${paramUserId}`, "Article")}
          {this.getCategoryBtn(`/users/${paramUserId}/review`, "Review")}
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

  private clearArticlesToShow = () => {
    const { dispatch } = this.props;

    dispatch(clearArticlesToShow());
  };

  private clearEvaluationIdsToShow = () => {
    const { dispatch } = this.props;

    dispatch(clearEvaluationIdsToShow());
  };

  private handleVotePeerEvaluation = (articleId: number, evaluationId: number) => {
    const { dispatch } = this.props;

    dispatch(votePeerReview(articleId, evaluationId));
  };

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

  public render() {
    const { articles, currentUserState, profileState, evaluations, match } = this.props;
    const { profileImage, institution, major } = currentUserState;
    const { isLoading, profileImageInput, institutionInput, majorInput, userProfile } = profileState;
    const userId = parseInt(match.params.userId, 10);
    let walletAddress = "not yet made";

    if (userProfile.wallet !== null && userProfile.wallet.address !== null) {
      walletAddress = userProfile.wallet.address;
    }

    return (
      <div>
        {this.getUpperContainer()}
        <div className={styles.lowerContainer}>
          <Switch>
            <Route exact path={`${match.url}/wallet`}>
              <Wallet tokenBalance={mockTokenBalance} walletAddress={walletAddress} />
            </Route>
            <Route exact path={`${match.url}/review`}>
              <ProfileEvaluations
                articles={articles}
                handleVotePeerEvaluation={this.handleVotePeerEvaluation}
                currentUser={currentUserState}
                clearFunction={this.clearEvaluationIdsToShow}
                userId={userId}
                fetchEvaluations={this.fetchUserEvaluations}
                cancelFetchingFunction={this.cancelOnGoingEvaluationRequest}
                profileState={profileState}
                evaluations={evaluations}
              />
            </Route>
            <Route exact path={`${match.url}/setting`}>
              <Setting
                isLoading={isLoading}
                handlePassInvalidUser={this.handlePassInvalidUser}
                isValidUser={currentUserState.isLoggedIn && currentUserState.id === userId}
                previousProfileImage={profileImage}
                profileImageInput={profileImageInput}
                changeProfileImageInput={this.changeProfileImageInput}
                previousInstitution={institution}
                institutionInput={institutionInput}
                changeInstitutionInput={this.changeInstitutionInput}
                previousMajor={major}
                majorInput={majorInput}
                changeMajorInput={this.changeMajorInput}
                updateCurrentUserProfile={this.updateCurrentUserProfile}
              />
            </Route>
            <Route>
              <UserArticles
                clearFunction={this.clearArticlesToShow}
                userId={userId}
                fetchUserArticles={this.fetchUserArticles}
                cancelFetchingFunction={this.cancelOnGoingArticleRequest}
                profileState={profileState}
              />
            </Route>
          </Switch>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ProfileContainer);
