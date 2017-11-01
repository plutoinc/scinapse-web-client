import { List } from "immutable";
import * as React from "react";
import { IEvaluationsRecord } from "../../../../model/evaluation";
import PeerEvaluation from "../peerEvaluation";
import { IPeerEvaluationProps } from "../peerEvaluation";
import { IEvaluationCommentsState } from "../../records";
import Icon from "../../../../icons";
const styles = require("./peerEvaluationList.scss");

interface IPeerEvaluationListProps extends IPeerEvaluationProps {
  evaluations: IEvaluationsRecord;
  commentsState: List<IEvaluationCommentsState>;
  fetchComments: (articleId: number, evaluationId: number, page?: number) => void;
}

class PeerEvaluationList extends React.PureComponent<IPeerEvaluationListProps, {}> {
  private mapEvaluations() {
    const {
      handleVotePeerEvaluation,
      handlePeerEvaluationCommentSubmit,
      articleShow,
      currentUser,
      comments,
      evaluations,
      handleTogglePeerEvaluation,
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
      const commentState = commentsState.find(commentState => commentState.evaluationId === evaluation.id);
      const targetComments = comments.filter(comment => comment.evaluationId === evaluation.id).toList();

      return (
        <PeerEvaluation
          comments={targetComments}
          commentState={commentState}
          key={evaluation.id}
          evaluation={evaluation}
          handleTogglePeerEvaluation={handleTogglePeerEvaluation}
          currentUser={currentUser}
          articleShow={articleShow}
          handlePeerEvaluationCommentSubmit={handlePeerEvaluationCommentSubmit}
          handleVotePeerEvaluation={handleVotePeerEvaluation}
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
