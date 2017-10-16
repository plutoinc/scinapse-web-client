import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Link, Switch, Route, RouteComponentProps } from "react-router-dom";
import { IAppState } from "../../../reducers";
import Icon from "../../../icons";
import * as Actions from "./actions";
import { IMyPageStateRecord } from "./records";
import { ICurrentUserRecord } from "../../../model/currentUser";
// Components
import Wallet from "./components/wallet";
import Setting from "./components/setting";
// Styles
const styles = require("./myPage.scss");

interface IMyPageContainerProps extends DispatchProp<IMyPageContainerMappedState>, RouteComponentProps<null> {
  myPageState: IMyPageStateRecord;
  currentUserState: ICurrentUserRecord;
}

interface IMyPageContainerMappedState {
  myPageState: IMyPageStateRecord;
  currentUserState: ICurrentUserRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    myPageState: state.myPage,
    currentUserState: state.currentUser,
  };
}

const mockInstitution = "Postech";
const mockMajor = "Creative Interesting Technology Engineer";
const mockArticleNum = 3;
const mockEvaluationNum = 10;

const mockTokenBalance = 3;
const mockWalletAddress = "0x822408EAC8C331002BE00070AFDD2A5A02065D3F";

class MyPage extends React.PureComponent<IMyPageContainerProps, {}> {
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

  private getCategoryBtn = (path: string, content: string) => {
    const locationArr = this.props.location.pathname.split("/");
    const currentPath = locationArr[locationArr.length - 1] || locationArr[locationArr.length - 2];

    return (
      <Link
        to={`/users/my_page/${path}`}
        className={path === currentPath ? `${styles.categoryBtn} ${styles.isClickedBtn}` : styles.categoryBtn}
      >
        {content}
      </Link>
    );
  };

  public render() {
    const { currentUserState } = this.props;
    const { name, reputation, profileImage } = currentUserState;

    return (
      <div>
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
            <Link to="/users/my_page/setting" className={styles.configureIconWrapper}>
              <Icon icon="SETTING_BUTTON" />
            </Link>
            <Link className={styles.submitArticleBtn} to="/articles/new">
              Submit Article
            </Link>
          </div>
          <div className={styles.categoryContainer}>
            {this.getCategoryBtn("article", "Article")}
            {this.getCategoryBtn("evaluation", "Evaluation")}
            {this.getCategoryBtn("wallet", "Wallet")}
            {this.getCategoryBtn("setting", "Setting")}
          </div>
        </div>
        <div className={styles.lowerContainer}>
          <div className={styles.innerContainer}>
            <Switch>
              <Route
                exact
                path="/users/my_page/setting"
                children={
                  <Setting
                    profileImage={profileImage}
                    changeProfileImageInput={this.changeProfileImageInput}
                    institution={mockInstitution}
                    changeInstitutionInput={this.changeInstitutionInput}
                    major={mockMajor}
                    changeMajorInput={this.changeMajorInput}
                  />
                }
              />
              <Route
                exact
                path="/users/my_page/wallet"
                children={<Wallet tokenBalance={mockTokenBalance} walletAddress={mockWalletAddress} />}
              />
              <Route exact path="/users/my_page/article" children={<div>Article</div>} />
              <Route exact path="/users/my_page/evaluation" children={<div>evaluation</div>} />
              <Route path="" children={<div>404! Not Found </div>} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(MyPage);
