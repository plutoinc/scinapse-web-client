import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { IAppState } from "../../../reducers";
import Icon from "../../../icons";
import * as Actions from "./actions";

import { IMyPageStateRecord, MY_PAGE_CATEGORY_TYPE } from "./records";
import { Link } from "react-router-dom";

const styles = require("./myPage.scss");

interface IMyPageContainerProps extends DispatchProp<IMyPageContainerMappedState> {
  myPageState: IMyPageStateRecord;
}

interface IMyPageContainerMappedState {
  myPageState: IMyPageStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    myPageState: state.myPage,
  };
}
const mockUserName = "Miheiz";
const mockContent = "Postech, Computer Science";
const mockHistory = "Article  3  |   Evaluation  10 ";

class MyPage extends React.PureComponent<IMyPageContainerProps, {}> {
  private getLowerContainer() {
    const { myPageState } = this.props;

    switch (myPageState.category) {
      case MY_PAGE_CATEGORY_TYPE.ARTICLE: {
        return <div>ARTICLE</div>;
      }
      case MY_PAGE_CATEGORY_TYPE.EVALUATION: {
        return <div>EVALUATION</div>;
      }
      case MY_PAGE_CATEGORY_TYPE.SETTING: {
        return <div>SETTING</div>;
      }
      case MY_PAGE_CATEGORY_TYPE.WALLET: {
        return <div>WALLET</div>;
      }
    }
  }

  private changeCategory(category: MY_PAGE_CATEGORY_TYPE) {
    const { dispatch } = this.props;
    dispatch(Actions.changeCategory(category));
  }

  public render() {
    const { myPageState } = this.props;
    const { category } = myPageState;
    return (
      <div>
        <div className={styles.upperContainer}>
          <div className={styles.profileContainer}>
            <Icon className={styles.avatarIconWrapper} icon="AVATAR" />
            <div className={styles.profileDescription}>
              <div className={styles.userName}>{mockUserName}</div>
              <div className={styles.userDegree}>{mockContent}</div>
              <div className={styles.userHistory}>{mockHistory}</div>
            </div>
            <Link to="settings">
              <Icon className={styles.configureIconBtn} icon="SETTING_BUTTON" />
            </Link>
            <Link className={styles.submitArticleBtn} to="/submit">
              Submit Article
            </Link>
          </div>
          <div className={styles.categoryContainer}>
            <div
              onClick={() => {
                this.changeCategory(MY_PAGE_CATEGORY_TYPE.ARTICLE);
              }}
              className={
                category === MY_PAGE_CATEGORY_TYPE.ARTICLE ? (
                  `${styles.categoryBtn} ${styles.isClickedBtn}`
                ) : (
                  styles.categoryBtn
                )
              }
            >
              Article
            </div>
            <div
              onClick={() => {
                this.changeCategory(MY_PAGE_CATEGORY_TYPE.EVALUATION);
              }}
              className={
                category === MY_PAGE_CATEGORY_TYPE.EVALUATION ? (
                  `${styles.categoryBtn} ${styles.isClickedBtn}`
                ) : (
                  styles.categoryBtn
                )
              }
            >
              Evaluation
            </div>
            <div
              onClick={() => {
                this.changeCategory(MY_PAGE_CATEGORY_TYPE.WALLET);
              }}
              className={
                category === MY_PAGE_CATEGORY_TYPE.WALLET ? (
                  `${styles.categoryBtn} ${styles.isClickedBtn}`
                ) : (
                  styles.categoryBtn
                )
              }
            >
              Wallet
            </div>
            <div
              onClick={() => {
                this.changeCategory(MY_PAGE_CATEGORY_TYPE.SETTING);
              }}
              className={
                category === MY_PAGE_CATEGORY_TYPE.SETTING ? (
                  `${styles.categoryBtn} ${styles.isClickedBtn}`
                ) : (
                  styles.categoryBtn
                )
              }
            >
              Setting
            </div>
          </div>
        </div>
        <div className={styles.lowerContainer}>{this.getLowerContainer()}</div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(MyPage);
