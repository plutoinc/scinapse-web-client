import { List } from "immutable";
import * as React from "react";
import { IReviewsRecord } from "../../../../model/review";
import PeerReview from "../peerReview";
import { IPeerReviewProps } from "../peerReview";
import { IReviewCommentsState } from "../../records";
import Icon from "../../../../icons";
const styles = require("./peerEvaluationList.scss");

interface IPeerEvaluationListProps extends IPeerReviewProps {
  evaluations: IReviewsRecord;
  commentsState: List<IReviewCommentsState>;
  fetchComments: (articleId: number, evaluationId: number, page?: number) => void;
}

class PeerEvaluationList extends React.PureComponent<IPeerEvaluationListProps, {}> {
  private mapEvaluations() {
    const {
      handleVotePeerReview,
      handlePeerReviewCommentSubmit,
      articleShow,
      currentUser,
      comments,
      evaluations,
      handleTogglePeerReview,
      commentsState,
    } = this.props;

    if (!evaluations || evaluations.isEmpty()) {
      return (
        <div className={styles.noEvaluationContainer}>
          <Icon className={styles.noEvaluationIconWrapper} icon="FOOTER_LOGO" />
          <div className={styles.noEvaluationContent}>There are no registered evaluation yet.</div>
        </div>
      );
    }

    return evaluations.map(evaluation => {
      const commentState = commentsState.find(commentState => commentState.reviewId === evaluation.id);
      const targetComments = comments.filter(comment => comment.evaluationId === evaluation.id).toList();

      return (
        <PeerReview
          comments={targetComments}
          commentState={commentState}
          key={evaluation.id}
          review={evaluation}
          handleTogglePeerReview={handleTogglePeerReview}
          currentUser={currentUser}
          articleShow={articleShow}
          handlePeerReviewCommentSubmit={handlePeerReviewCommentSubmit}
          handleVotePeerReview={handleVotePeerReview}
        />
      );
    });
  }

  public componentDidMount() {
    const { fetchComments, evaluations } = this.props;

    evaluations.forEach(evaluation => {
      fetchComments(evaluation.articleId, evaluation.id, 0);
    });
  }

  public render() {
    return <div>{this.mapEvaluations()}</div>;
  }
}

export default PeerEvaluationList;
