import * as React from "react";
import { ICurrentUserStateRecord } from "../../../../model/currentUser";
import { IArticleShowStateRecord } from "../../records";
import EvaluateUserInformation from "../evaluateUserInformation";
import Icon from "../../../../icons/index";
const styles = require("./peerEvaluation.scss");

interface IPeerEvaluationProps {
  currentUser: ICurrentUserStateRecord;
  articleShow: IArticleShowStateRecord;
}

class PeerEvaluation extends React.PureComponent<IPeerEvaluationProps, {}> {
  private getClosedBox = () => {
    const { articleShow, currentUser } = this.props;

    if (articleShow.isPeerEvaluationOpen) {
      return (
        <div className={styles.header}>
          <EvaluateUserInformation currentUser={currentUser} />
        </div>
      );
    } else {
      return (
        <div className={styles.closedHeader}>
          <EvaluateUserInformation className={styles.headerLeftBox} currentUser={currentUser} />
          <div className={styles.headerRightBox}>
            <span className={styles.scoreBox}>
              <span className={styles.scoreItem}>5</span>
              <span className={styles.scoreItem}>5</span>
              <span className={styles.scoreItem}>5</span>
              <span className={styles.scoreItem}>5</span>
              <span className={styles.scoreItem}>5</span>
            </span>
            <span className={styles.actionItemsWrapper}>
              {/* TODO: Add star icon and Link data */}
              <Icon className={styles.starIcon} icon="STAR" />
              <span className={styles.rightItem}>9</span>
              <Icon className={styles.commentIcon} icon="COMMENT" />
              <span className={styles.rightItem}>3</span>
            </span>
            <span className={styles.openButton}>^</span>
          </div>
        </div>
      );
    }
  };

  public render() {
    const { articleShow } = this.props;

    if (articleShow.isPeerEvaluationOpen) {
      return <div className={styles.peerEvaluationContainer} />;
    } else {
      return this.getClosedBox();
    }
  }
}

export default PeerEvaluation;
