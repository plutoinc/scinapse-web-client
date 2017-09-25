import * as React from "react";
import { ICurrentUserRecord } from "../../../../model/currentUser";
import { IArticleShowStateRecord } from "../../records";
import EvaluateUserInformation from "../evaluateUserInformation";
import Icon from "../../../../icons";
import { mockContent } from "../evaluate/finalStep";
import EvaluationContent from "../evaluationContent";
const styles = require("./peerEvaluation.scss");

export interface IPeerEvaluationProps {
  currentUser: ICurrentUserRecord;
  articleShow: IArticleShowStateRecord;
  handleOpenPeerEvaluation: () => void;
  handleClosePeerEvaluation: () => void;
}

class PeerEvaluation extends React.PureComponent<IPeerEvaluationProps, {}> {
  private getOpenedBox = () => {
    const { currentUser, handleClosePeerEvaluation } = this.props;

    return (
      <div className={styles.peerEvaluationContainer}>
        <div className={styles.openedHeader}>
          <EvaluateUserInformation className={styles.headerLeftBox} currentUser={currentUser} />
          <div className={styles.headerRightBox}>
            <span className={styles.actionItemsWrapper}>
              {/* TODO: Add star icon and Link data */}
              <Icon className={styles.starIcon} icon="STAR" />
              <span className={styles.rightItem}>9</span>
              <Icon className={styles.commentIcon} icon="COMMENT" />
              <span className={styles.rightItem}>3</span>
            </span>
            <span onClick={handleClosePeerEvaluation} className={styles.toggleButtonWrapper}>
              <Icon className={styles.toggleButton} icon="CLOSE_ARTICLE_EVALUATION" />
            </span>
          </div>
        </div>
        <div className={styles.evaluationContentWrapper}>
          {/* TODO: Change below data as each evaluation's data */}
          <EvaluationContent
            originalityScore={5}
            contributionScore={5}
            analysisScore={5}
            expressivenessScore={5}
            originalityComment={mockContent}
            contributionComment={mockContent}
            analysisComment={mockContent}
            expressivenessComment={mockContent}
          />
        </div>
      </div>
    );
  };

  private getClosedBox = () => {
    const { currentUser, handleOpenPeerEvaluation } = this.props;
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
          <span onClick={handleOpenPeerEvaluation} className={styles.toggleButtonWrapper}>
            <Icon className={styles.toggleButton} icon="OPEN_ARTICLE_EVALUATION" />
          </span>
        </div>
      </div>
    );
  };

  public render() {
    const { articleShow } = this.props;

    if (articleShow.isPeerEvaluationOpen) {
      return this.getOpenedBox();
    } else {
      return this.getClosedBox();
    }
  }
}

export default PeerEvaluation;
