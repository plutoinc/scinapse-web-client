import { List } from "immutable";
import * as React from "react";
import { IEvaluationsRecord } from "../../../../model/evaluation";
import PeerEvaluation from "../peerEvaluation";
import { IPeerEvaluationProps } from "../peerEvaluation";
import { IEvaluationCommentsState } from "../../records";

interface IPeerEvaluationListProps extends IPeerEvaluationProps {
  evaluations: IEvaluationsRecord;
  commentsState: List<IEvaluationCommentsState>;
  fetchComments: (articleId: number, evaluationId: number, page?: number) => void;
}

class PeerEvaluationList extends React.PureComponent<IPeerEvaluationListProps, {}> {
  public componentDidMount() {
    const { fetchComments, evaluations } = this.props;

    evaluations.forEach(evaluation => {
      fetchComments(evaluation.articleId, evaluation.id, 0);
    });
  }

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
      return <div>Nothing...</div>;
    }

    return evaluations.map(evaluation => {
      const commentState = commentsState.find(commentState => commentState.evaluationId === evaluation.id);

      return (
        <PeerEvaluation
          comments={comments}
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

  public render() {
    return <div>{this.mapEvaluations()}</div>;
  }
}

export default PeerEvaluationList;
