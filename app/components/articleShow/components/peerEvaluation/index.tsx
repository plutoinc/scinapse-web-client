import * as React from "react";
import { ICurrentUserRecord } from "../../../../model/currentUser";
import { IArticleShowStateRecord } from "../../records";
import EvaluateUserInformation from "../evaluateUserInformation";
import Icon from "../../../../icons";
import EvaluationContent from "../evaluationContent";
import { IEvaluationRecord } from "../../../../model/evaluation";
import EvaluationComments, { IEvaluationCommentsProps } from "./comments";
const styles = require("./peerEvaluation.scss");

export interface IPeerEvaluationProps extends IEvaluationCommentsProps {
  id: string;
  evaluation: IEvaluationRecord;
  currentUser: ICurrentUserRecord;
  articleShow: IArticleShowStateRecord;
  handleTogglePeerEvaluation: (peerEvaluationId: string) => void;
}

class PeerEvaluation extends React.PureComponent<IPeerEvaluationProps, {}> {
  private getOpenedBox = () => {
    const { currentUser, evaluation, handleTogglePeerEvaluation, id, handlePeerEvaluationCommentSubmit } = this.props;

    return (
      <div>
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
              <span
                onClick={() => {
                  handleTogglePeerEvaluation(id);
                }}
                className={styles.toggleButtonWrapper}
              >
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
        <EvaluationComments
          handlePeerEvaluationCommentSubmit={handlePeerEvaluationCommentSubmit}
          currentUser={currentUser}
          evaluation={evaluation}
        />
      </div>
    );
  };

  private getClosedBox = () => {
    const { currentUser, evaluation, handleTogglePeerEvaluation, id } = this.props;
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
          <span
            onClick={() => {
              handleTogglePeerEvaluation(id);
            }}
            className={styles.toggleButtonWrapper}
          >
            <Icon className={styles.toggleButton} icon="OPEN_ARTICLE_EVALUATION" />
          </span>
        </div>
      </div>
    );
  };

  public render() {
    const { articleShow, id } = this.props;

    if (articleShow.peerEvaluationId === id) {
      return this.getOpenedBox();
    } else {
      return this.getClosedBox();
    }
  }
}

export default PeerEvaluation;
