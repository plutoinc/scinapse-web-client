import * as React from "react";
import { ICurrentUserStateRecord } from "../../../../model/currentUser";
import { IArticleShowStateRecord } from "../../records";
import EvaluateUserInformation from "../evaluateUserInformation";
import Icon from "../../../../icons";
import EvaluationContent from "../evaluationContent";
import { IEvaluationRecord } from "../../../../model/evaluation";
const styles = require("./peerEvaluation.scss");

export interface IPeerEvaluationProps {
  evaluation: IEvaluationRecord;
  currentUser: ICurrentUserStateRecord;
  articleShow: IArticleShowStateRecord;
  handleOpenPeerEvaluation: () => void;
  handleClosePeerEvaluation: () => void;
}

class PeerEvaluation extends React.PureComponent<IPeerEvaluationProps, {}> {
  private getOpenedBox = () => {
    const { currentUser, evaluation, handleClosePeerEvaluation } = this.props;

    return (
      <div className={styles.peerEvaluationContainer}>
        <div className={styles.openedHeader}>
          <EvaluateUserInformation className={styles.headerLeftBox} currentUser={currentUser} />
          <div className={styles.headerRightBox}>
            <span className={styles.actionItemsWrapper}>
              <Icon className={styles.starIcon} icon="STAR" />
              <span className={styles.rightItem}>{evaluation.like}</span>
              <Icon className={styles.commentIcon} icon="COMMENT" />
              <span className={styles.rightItem}>{evaluation.comments.count()}</span>
            </span>
            <span onClick={handleClosePeerEvaluation} className={styles.toggleButtonWrapper}>
              <Icon className={styles.toggleButton} icon="CLOSE_ARTICLE_EVALUATION" />
            </span>
          </div>
        </div>
        <div className={styles.evaluationContentWrapper}>
          <EvaluationContent
            originalityScore={evaluation.point.originality}
            contributionScore={evaluation.point.contribution}
            analysisScore={evaluation.point.analysis}
            expressivenessScore={evaluation.point.expressiveness}
            originalityComment={evaluation.point.originalityComment}
            contributionComment={evaluation.point.contributionComment}
            analysisComment={evaluation.point.analysisComment}
            expressivenessComment={evaluation.point.expressivenessComment}
          />
        </div>
      </div>
    );
  };

  private getClosedBox = () => {
    const { currentUser, evaluation, handleOpenPeerEvaluation } = this.props;
    return (
      <div className={styles.closedHeader}>
        <EvaluateUserInformation className={styles.headerLeftBox} currentUser={currentUser} />
        <div className={styles.headerRightBox}>
          <span className={styles.scoreBox}>
            <span className={styles.scoreItem}>{evaluation.point.originality}</span>
            <span className={styles.scoreItem}>{evaluation.point.contribution}</span>
            <span className={styles.scoreItem}>{evaluation.point.analysis}</span>
            <span className={styles.scoreItem}>{evaluation.point.expressiveness}</span>
            <span className={styles.scoreItem}>{evaluation.point.total}</span>
          </span>
          <span className={styles.actionItemsWrapper}>
            <Icon className={styles.starIcon} icon="STAR" />
            <span className={styles.rightItem}>{evaluation.like}</span>
            <Icon className={styles.commentIcon} icon="COMMENT" />
            <span className={styles.rightItem}>{evaluation.comments.count()}</span>
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
