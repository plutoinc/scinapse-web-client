import * as React from "react";
import axios, { CancelTokenSource } from "axios";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import * as moment from "moment";
import { IAppState } from "../../reducers";
import { ICurrentUserRecord } from "../../model/currentUser";
import Type from "./components/type";
import ArticleInfo from "./components/articleInfo";
import AuthorList from "./components/authorList";
import Abstract from "./components/abstract";
import Article from "./components/article";
import ArticleEvaluate from "./components/evaluate";
import { IArticleShowStateRecord, ARTICLE_EVALUATION_STEP } from "./records";
import * as Actions from "./actions";
import { IArticleRecord } from "../../model/article";
import EvaluateSummary from "./components/summary";
import ArticleNote from "./components/note";
import { selectArticle, selectEvaluations } from "./select";
import { IEvaluationsRecord } from "../../model/evaluation";
import { ICommentsRecord } from "../../model/comment";

const styles = require("./articleShow.scss");

interface IArticlePageParams {
  articleId?: string;
}

interface IArticleShowProps extends RouteComponentProps<IArticlePageParams>, DispatchProp<any> {
  currentUser: ICurrentUserRecord;
  articleShow: IArticleShowStateRecord;
  evaluations: IEvaluationsRecord;
  comments: ICommentsRecord;
  article: IArticleRecord | null;
}

function mapStateToProps(state: IAppState, props: IArticleShowProps) {
  const articleId = parseInt(props.match.params.articleId, 10);

  return {
    currentUser: state.currentUser,
    articleShow: state.articleShow,
    evaluations: selectEvaluations(state.evaluations, state.articleShow.evaluationIdsToShow),
    comments: state.comments,
    article: selectArticle(state.articles, articleId),
  };
}

@withRouter
class ArticleShow extends React.PureComponent<IArticleShowProps, {}> {
  private cancelTokenSource: CancelTokenSource | undefined;
  private evaluationsCancelTokenSource: CancelTokenSource | undefined;
  private commentsCancelTokenSource: CancelTokenSource | undefined;

  private handleSubmitEvaluation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { dispatch, article, articleShow } = this.props;

    dispatch(
      Actions.submitEvaluation({
        articleId: article.id,
        originalityScore: articleShow.myOriginalityScore,
        originalityComment: articleShow.myOriginalityComment,
        significanceScore: articleShow.mySignificanceScore,
        significanceComment: articleShow.mySignificanceComment,
        validityScore: articleShow.myValidityScore,
        validityComment: articleShow.myValidityComment,
        organizationScore: articleShow.myOrganizationScore,
        organizationComment: articleShow.myOrganizationComment,
      }),
    );
  };

  private handleTogglePeerEvaluation = (peerEvaluationId: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.togglePeerEvaluationComponent(peerEvaluationId));
  };

  private handleEvaluationTabChange = () => {
    const { dispatch } = this.props;

    dispatch(Actions.changeArticleEvaluationTab());
  };

  private handleClickStepButton = (step: ARTICLE_EVALUATION_STEP) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeEvaluationStep(step));
  };

  private goToNextStep = () => {
    const { dispatch, articleShow } = this.props;

    if (articleShow.currentStep !== ARTICLE_EVALUATION_STEP.FOURTH) {
      dispatch(Actions.changeEvaluationStep(articleShow.currentStep + 1));
    }
  };

  private handleClickScore = (step: ARTICLE_EVALUATION_STEP, score: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeEvaluationScore(step, score));
  };

  private handleEvaluationChange = (step: ARTICLE_EVALUATION_STEP, comment: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeEvaluationComment(step, comment));
  };

  private handlePeerEvaluationCommentSubmit = (params: Actions.IHandlePeerEvaluationCommentSubmitParams) => {
    const { dispatch } = this.props;
    const { comment, articleId, evaluationId } = params;

    dispatch(
      Actions.handlePeerEvaluationCommentSubmit({
        comment,
        articleId,
        evaluationId,
      }),
    );
  };

  private handleVotePeerEvaluation = (articleId: number, evaluationId: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.votePeerEvaluation(articleId, evaluationId));
  };

  private fetchArticle = (articleId: number) => {
    const { dispatch } = this.props;
    const CancelToken = axios.CancelToken;
    this.cancelTokenSource = CancelToken.source();

    dispatch(Actions.getArticle(articleId, this.cancelTokenSource));
  };

  private fetchEvaluations = (articleId: number) => {
    const { dispatch, articleShow } = this.props;

    const CancelToken = axios.CancelToken;
    this.evaluationsCancelTokenSource = CancelToken.source();

    dispatch(
      Actions.getEvaluations({
        articleId,
        page: articleShow.evaluationPage,
        cancelTokenSource: this.evaluationsCancelTokenSource,
      }),
    );
  };

  private fetchComments = (articleId: number, evaluationId: number, page?: number) => {
    const { dispatch } = this.props;

    const CancelToken = axios.CancelToken;
    this.commentsCancelTokenSource = CancelToken.source();

    dispatch(
      Actions.getComments({
        articleId,
        evaluationId,
        page,
        cancelTokenSource: this.commentsCancelTokenSource,
      }),
    );
  };

  private cancelOnGoingRequests = () => {
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel("Request Canceled");
    }

    if (this.evaluationsCancelTokenSource) {
      this.evaluationsCancelTokenSource.cancel("Request Canceled!");
    }

    if (this.commentsCancelTokenSource) {
      this.commentsCancelTokenSource.cancel("Request Canceled!");
    }
  };

  public componentDidMount() {
    const { match } = this.props;
    const articleId = parseInt(match.params.articleId, 10);

    // Scroll Restoration
    window.scrollTo(0, 0);

    if (articleId) {
      this.fetchArticle(articleId);
      this.fetchEvaluations(articleId);
    }
  }

  public componentWillReceiveProps(nextProps: IArticleShowProps) {
    const currentParamArticleId = this.props.match.params.articleId;
    const nextParamArticleId = nextProps.match.params.articleId;

    if (nextParamArticleId !== currentParamArticleId) {
      this.cancelOnGoingRequests();
      this.fetchArticle(parseInt(nextParamArticleId, 10));
      this.fetchEvaluations(parseInt(nextParamArticleId, 10));
    }
  }

  public componentWillUnmount() {
    this.cancelOnGoingRequests();
  }

  public render() {
    const { article, articleShow, currentUser, evaluations, comments } = this.props;
    if (!article || articleShow.isLoading) {
      return <div>Loading... </div>;
    } else {
      const { type, summary, authors, createdAt, createdBy, link, source, title, note } = article;

      return (
        <div className={styles.articleShowContainer}>
          <div className={styles.articleContentContainer}>
            <Type tag={type} />
            <div className={styles.title}>{title}</div>
            <ArticleInfo from={source} createdAt={moment(createdAt).format("ll")} createdBy={createdBy} />
            <AuthorList authors={authors} />
            <Abstract content={summary} />
            <ArticleNote note={note} />
            <Article link={link} />
            <ArticleEvaluate
              currentUser={currentUser}
              evaluations={evaluations}
              articleShow={articleShow}
              article={article}
              comments={comments}
              commentsState={articleShow.commentStates}
              handleClickScore={this.handleClickScore}
              handleEvaluationTabChange={this.handleEvaluationTabChange}
              handleClickStepButton={this.handleClickStepButton}
              handleEvaluationChange={this.handleEvaluationChange}
              goToNextStep={this.goToNextStep}
              fetchComments={this.fetchComments}
              handleSubmitEvaluation={this.handleSubmitEvaluation}
              handleTogglePeerEvaluation={this.handleTogglePeerEvaluation}
              handlePeerEvaluationCommentSubmit={this.handlePeerEvaluationCommentSubmit}
              handleVotePeerEvaluation={this.handleVotePeerEvaluation}
            />
          </div>
          <div className={styles.evaluationSummaryContainer}>
            <EvaluateSummary article={article} />
          </div>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps)(ArticleShow);
