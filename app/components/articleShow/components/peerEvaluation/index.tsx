import * as React from "react";
import { ICurrentUserRecord } from "../../../../model/currentUser";
import { IArticleShowStateRecord, IEvaluationCommentsState } from "../../records";
import EvaluateUserInformation from "../evaluateUserInformation";
import Icon from "../../../../icons";
import EvaluationContent from "../evaluationContent";
import EvaluationComments, { IEvaluationCommentsProps } from "./comments";
import ArticleSpinner from "../../../common/spinner/articleSpinner";
import Tooltip from "../../../common/tooltip/tooltip";
import checkAuthDialog from "../../../../helpers/checkAuthDialog";
const styles = require("./peerEvaluation.scss");

export interface IPeerEvaluationProps extends IEvaluationCommentsProps {
  currentUser: ICurrentUserRecord;
  articleShow: IArticleShowStateRecord;
  commentState?: IEvaluationCommentsState;
  handleTogglePeerEvaluation: (peerEvaluationId: number) => void;
  handleVotePeerEvaluation: (articleId: number, evaluationId: number) => void;
}

class PeerEvaluation extends React.PureComponent<IPeerEvaluationProps, {}> {
  private getEvaluationComments = () => {
    const { currentUser, evaluation, handlePeerEvaluationCommentSubmit, comments, commentState } = this.props;

    if (commentState.isLoading) {
      return <ArticleSpinner />;
    } else {
      return (
        <EvaluationComments
          comments={comments}
          handlePeerEvaluationCommentSubmit={handlePeerEvaluationCommentSubmit}
          currentUser={currentUser}
          evaluation={evaluation}
        />
      );
    }
  };

  private getOpenedBox = () => {
    const { evaluation, handleTogglePeerEvaluation } = this.props;

    return (
      <div className={styles.peerEvaluationComponent}>
        <div className={styles.peerEvaluationContainer}>
          <div className={styles.openedHeader}>
            <EvaluateUserInformation className={styles.headerLeftBox} user={evaluation.createdBy} />
            <div className={styles.headerRightBox}>
              <span className={styles.actionItemsWrapper}>
                {this.getStarIcon()}
                <span className={styles.rightItem}>{evaluation.vote}</span>
                <Icon className={styles.commentIcon} icon="COMMENT" />
                <span className={styles.rightItem}>{evaluation.commentSize}</span>
              </span>
              <span
                onClick={() => {
                  handleTogglePeerEvaluation(evaluation.id);
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
        {this.getEvaluationComments()}
      </div>
    );
  };

  private getStarIcon = () => {
    const { evaluation, handleVotePeerEvaluation, currentUser } = this.props;

    if (currentUser.id === evaluation.createdBy.id) {
      return <Icon className={styles.starIcon} icon="EMPTY_STAR" />;
    } else if (evaluation.voted) {
      return <Icon className={styles.starIcon} icon="STAR" />;
    } else {
      return (
        <span
          onClick={() => {
            checkAuthDialog();
            if (currentUser.isLoggedIn) {
              handleVotePeerEvaluation(evaluation.articleId, evaluation.id);
            }
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
    const { evaluation, handleTogglePeerEvaluation } = this.props;

    return (
      <div className={styles.peerEvaluationComponent}>
        <div className={styles.closedHeader}>
          <EvaluateUserInformation className={styles.headerLeftBox} user={evaluation.createdBy} />
          <div className={styles.headerRightBox}>
            <span className={styles.scoreBox}>
              <span className={styles.scoreItem}>
                <Tooltip
                  className={styles.scoreItemTooltip}
                  left={-22}
                  top={-26}
                  iconTop={-6}
                  content={"Originality"}
                />
                {evaluation.point.originality}
              </span>
              <span className={styles.scoreItem}>
                <Tooltip
                  className={styles.scoreItemTooltip}
                  left={-26}
                  top={-26}
                  iconTop={-6}
                  content={"Significance"}
                />
                {evaluation.point.significance}
              </span>
              <span className={styles.scoreItem}>
                <Tooltip className={styles.scoreItemTooltip} left={-15} top={-26} iconTop={-6} content={"Validity"} />
                {evaluation.point.validity}
              </span>
              <span className={styles.scoreItem}>
                <Tooltip
                  className={styles.scoreItemTooltip}
                  left={-29}
                  top={-26}
                  iconTop={-6}
                  content={"Organization"}
                />
                {evaluation.point.organization}
              </span>
              <span className={styles.totalPoint}>{evaluation.point.total}</span>
            </span>
            <span className={styles.actionItemsWrapper}>
              {this.getStarIcon()}
              <span className={styles.rightItem}>{evaluation.vote}</span>
              <Icon className={styles.commentIcon} icon="COMMENT" />
              <span className={styles.rightItem}>{evaluation.commentSize}</span>
            </span>
            <span
              onClick={() => {
                handleTogglePeerEvaluation(evaluation.id);
              }}
              className={styles.toggleButtonWrapper}
            >
              <Icon className={styles.toggleButton} icon="OPEN_ARTICLE_EVALUATION" />
            </span>
          </div>
        </div>
      </div>
    );
  };

  public render() {
    const { commentState, articleShow, evaluation } = this.props;
    if (!commentState) {
      return null;
    }

    if (articleShow.peerEvaluationId === evaluation.id) {
      return this.getOpenedBox();
    } else {
      return this.getClosedBox();
    }
  }
}

export default PeerEvaluation;
