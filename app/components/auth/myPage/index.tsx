import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { IAppState } from "../../../reducers";
import Icon from "../../../icons";

import { IMyPageStateRecord } from "./records";
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
  public render() {
    return (
      <div className={styles.myPageContainer}>
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
      </div>
    );
  }
}

export default connect(mapStateToProps)(MyPage);
