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
  articleId: number;
  id: number;
  evaluation: IEvaluationRecord;
  currentUser: ICurrentUserRecord;
  articleShow: IArticleShowStateRecord;
  handleTogglePeerEvaluation: (peerEvaluationId: number) => void;
  handleVotePeerEvaluation: (articleId: number, evaluationId: number) => void;
}

class PeerEvaluation extends React.PureComponent<IPeerEvaluationProps, {}> {
  private getOpenedBox = () => {
    const {
      currentUser,
      evaluation,
      handleTogglePeerEvaluation,
      id,
      handlePeerEvaluationCommentSubmit,
      comments,
    } = this.props;

    return (
      <div>
        <div className={styles.peerEvaluationContainer}>
          <div className={styles.openedHeader}>
            <EvaluateUserInformation className={styles.headerLeftBox} user={evaluation.createdBy} />
            <div className={styles.headerRightBox}>
              <span className={styles.actionItemsWrapper}>
                <Icon className={styles.starIcon} icon="STAR" />
                <span className={styles.rightItem}>{evaluation.vote}</span>
                <Icon className={styles.commentIcon} icon="COMMENT" />
                <span className={styles.rightItem}>{evaluation.commentSize}</span>
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
              originalityComment={evaluation.point.originalityComment}
              significanceScore={evaluation.point.significance}
              significanceComment={evaluation.point.significanceComment}
              validityScore={evaluation.point.validity}
              validityComment={evaluation.point.validityComment}
              organizationScore={evaluation.point.organization}
              organizationComment={evaluation.point.organizationComment}
            />
          </div>
        </div>
        <EvaluationComments
          comments={comments}
          handlePeerEvaluationCommentSubmit={handlePeerEvaluationCommentSubmit}
          currentUser={currentUser}
          evaluation={evaluation}
        />
      </div>
    );
  };

  private getStarIcon = () => {
    const { evaluation, handleVotePeerEvaluation, articleId, id } = this.props;

    if (evaluation.voted) {
      return <Icon className={styles.starIcon} icon="STAR" />;
    } else {
      return (
        <span
          onClick={() => {
            handleVotePeerEvaluation(articleId, id);
          }}
          style={{ cursor: "pointer" }}
          className={styles.starIcon}
        >
          <Icon icon="EMPTY_STAR" />
        </span>
      );
    }
  };

  private getClosedBox = () => {
    const { currentUser, evaluation, handleTogglePeerEvaluation, id } = this.props;
    return (
      <div className={styles.closedHeader}>
        <EvaluateUserInformation className={styles.headerLeftBox} user={currentUser} />
        <div className={styles.headerRightBox}>
          <span className={styles.scoreBox}>
            <span className={styles.scoreItem}>{evaluation.point.originality}</span>
            <span className={styles.scoreItem}>{evaluation.point.significance}</span>
            <span className={styles.scoreItem}>{evaluation.point.validity}</span>
            <span className={styles.scoreItem}>{evaluation.point.organization}</span>
            <span className={styles.scoreItem}>{evaluation.point.total}</span>
          </span>
          <span className={styles.actionItemsWrapper}>
            {this.getStarIcon()}
            <span className={styles.rightItem}>{evaluation.vote}</span>
            <Icon className={styles.commentIcon} icon="COMMENT" />
            <span className={styles.rightItem}>{evaluation.commentSize}</span>
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
