import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { IAppState } from "../../../reducers";
import Icon from "../../../icons";
import * as Actions from "./actions";
import { IMyPageStateRecord, MY_PAGE_CATEGORY_TYPE } from "./records";
import { Link } from "react-router-dom";
import { ICurrentUserRecord } from "../../../model/currentUser";
// Components
import Wallet from "./components/wallet";
import Setting from "./components/setting";
// Styles
const styles = require("./myPage.scss");

interface IMyPageContainerProps extends DispatchProp<IMyPageContainerMappedState> {
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
  private getLowerContainer() {
    const { myPageState, currentUserState } = this.props;
    const { profileImage } = currentUserState;

    switch (myPageState.category) {
      case MY_PAGE_CATEGORY_TYPE.ARTICLE: {
        return <div>ARTICLE</div>;
      }
      case MY_PAGE_CATEGORY_TYPE.EVALUATION: {
        return <div>EVALUATION</div>;
      }
      case MY_PAGE_CATEGORY_TYPE.SETTING: {
        return (
          <Setting
            profileImage={profileImage}
            changeProfileImageInput={this.changeProfileImageInput}
            institution={mockInstitution}
            changeInstitutionInput={this.changeInstitutionInput}
            major={mockMajor}
            changeMajorInput={this.changeMajorInput}
          />
        );
      }
      case MY_PAGE_CATEGORY_TYPE.WALLET: {
        return <Wallet tokenBalance={mockTokenBalance} walletAddress={mockWalletAddress} />;
      }
    }
  }

  private changeCategory = (category: MY_PAGE_CATEGORY_TYPE) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeCategory(category));
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

  private getCategoryBtn = (type: MY_PAGE_CATEGORY_TYPE, content: string) => {
    const { category } = this.props.myPageState;

    return (
      <div
        onClick={() => {
          this.changeCategory(type);
        }}
        className={category === type ? `${styles.categoryBtn} ${styles.isClickedBtn}` : styles.categoryBtn}
      >
        {content}
      </div>
    );
  };

  public render() {
    const { name, reputation } = this.props.currentUserState;

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
            <div
              className={styles.configureIconWrapper}
              onClick={() => {
                this.changeCategory(MY_PAGE_CATEGORY_TYPE.SETTING);
              }}
            >
              <Icon icon="SETTING_BUTTON" />
            </div>
            <Link className={styles.submitArticleBtn} to="/submit">
              Submit Article
            </Link>
          </div>
          <div className={styles.categoryContainer}>
            {this.getCategoryBtn(MY_PAGE_CATEGORY_TYPE.ARTICLE, "Article")}
            {this.getCategoryBtn(MY_PAGE_CATEGORY_TYPE.EVALUATION, "Evaluation")}
            {this.getCategoryBtn(MY_PAGE_CATEGORY_TYPE.WALLET, "Wallet")}
            {this.getCategoryBtn(MY_PAGE_CATEGORY_TYPE.SETTING, "Setting")}
          </div>
        </div>
        <div className={styles.lowerContainer}>
          <div className={styles.innerContainer}>{this.getLowerContainer()}</div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(MyPage);
