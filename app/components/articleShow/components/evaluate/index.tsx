import * as React from "react";
import { List } from "immutable";
import { ARTICLE_EVALUATION_STEP, IArticleShowStateRecord, IEvaluationCommentsState } from "../../records";
import { IEvaluateStepProps } from "./evaluateStep";
import { IArticleRecord } from "../../../../model/article";
import { IHandlePeerEvaluationCommentSubmitParams } from "../../actions";
import ArticleSpinner from "../../../common/spinner/articleSpinner";
import { ICurrentUserRecord } from "../../../../model/currentUser";
import { IEvaluationsRecord } from "../../../../model/evaluation";
import { ICommentsRecord } from "../../../../model/comment";
import PeerEvaluationList from "../peerEvaluationList";
import MyEvaluation from "../myEvaluation";
const styles = require("./evaluate.scss");

interface IArticleEvaluateProps extends IEvaluateStepProps {
  article: IArticleRecord;
  evaluations: IEvaluationsRecord;
  currentUser: ICurrentUserRecord;
  articleShow: IArticleShowStateRecord;
  comments: ICommentsRecord;
  commentsState: List<IEvaluationCommentsState>;
  handleClickScore: (step: ARTICLE_EVALUATION_STEP, score: number) => void;
  handleSubmitEvaluation: (e: React.FormEvent<HTMLFormElement>) => void;
  goToNextStep: () => void;
  handleTogglePeerEvaluation: (peerEvaluationId: number) => void;
  handlePeerEvaluationCommentSubmit: (params: IHandlePeerEvaluationCommentSubmitParams) => void;
  handleVotePeerEvaluation: (articleId: number, evaluationId: number) => void;
  fetchComments: (articleId: number, evaluationId: number, page?: number) => void;
  handleReviewChange: (review: string) => void;
}

function getMyEvaluationComponent(props: IArticleEvaluateProps) {
  const isFinal =
    props.currentUser && props.evaluations && props.articleShow.currentStep === ARTICLE_EVALUATION_STEP.FINAL;

  if (isFinal || props.article.evaluated) {
    return null;
  } else {
    return (
      <MyEvaluation
        article={props.article}
        articleShow={props.articleShow}
        handleClickScore={props.handleClickScore}
        goToNextStep={props.goToNextStep}
        handleClickStepButton={props.handleClickStepButton}
        handleSubmitEvaluation={props.handleSubmitEvaluation}
        handleReviewChange={props.handleReviewChange}
      />
    );
  }
}

function getEvaluationComponent(props: IArticleEvaluateProps) {
  if (props.articleShow.isEvaluationSubmitLoading) {
    return <ArticleSpinner className={styles.spinnerWrapper} />;
  } else if (props.evaluations.count() === 0) {
    return <div>{getMyEvaluationComponent(props)}</div>;
  } else {
    return (
      <div>
        {getMyEvaluationComponent(props)}
        <PeerEvaluationList
          fetchComments={props.fetchComments}
          commentsState={props.commentsState}
          handleVotePeerEvaluation={props.handleVotePeerEvaluation}
          handlePeerEvaluationCommentSubmit={props.handlePeerEvaluationCommentSubmit}
          articleShow={props.articleShow}
          currentUser={props.currentUser}
          comments={props.comments}
          evaluations={props.evaluations}
          handleTogglePeerEvaluation={props.handleTogglePeerEvaluation}
        />
      </div>
    );
  }
}

const ArticleEvaluate = (props: IArticleEvaluateProps) => {
  return (
    <div className={styles.evaluateWrapper}>
      <div className={styles.title}>Review</div>
      {getEvaluationComponent(props)}
    </div>
  );
};

export default ArticleEvaluate;
