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
import ArticleReview from "./components/evaluate";
import { IArticleShowStateRecord, ARTICLE_REVIEW_STEP } from "./records";
import * as Actions from "./actions";
import { IArticleRecord } from "../../model/article";
import EvaluateSummary from "./components/summary";
import ArticleNote from "./components/note";
import { selectArticle, selectEvaluations } from "./select";
import { IReviewsRecord } from "../../model/review";
import { ICommentsRecord } from "../../model/comment";
import { IPostCommentParams } from "../../api/article";

const styles = require("./articleShow.scss");

const NAVBAR_HEIGHT = 65;

interface IArticlePageParams {
  articleId?: string;
}

export interface IArticleShowProps extends RouteComponentProps<IArticlePageParams>, DispatchProp<any> {
  currentUser: ICurrentUserRecord;
  articleShow: IArticleShowStateRecord;
  evaluations: IReviewsRecord;
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
  private evaluateWrapperNode: HTMLDivElement;

  private handleSubmitEvaluation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { dispatch, article, articleShow } = this.props;

    dispatch(
      Actions.submitEvaluation({
        articleId: article.id,
        originalityScore: articleShow.myOriginalityScore,
        significanceScore: articleShow.mySignificanceScore,
        validityScore: articleShow.myValidityScore,
        organizationScore: articleShow.myOrganizationScore,
        review: articleShow.reviewInput,
        cancelTokenSource: this.evaluationsCancelTokenSource,
      }),
    );
  };

  private handleTogglePeerEvaluation = (peerEvaluationId: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.togglePeerEvaluationComponent(peerEvaluationId));
  };

  private goToNextStep = () => {
    const { dispatch, articleShow } = this.props;

    if (articleShow.currentStep !== ARTICLE_REVIEW_STEP.FIFTH) {
      dispatch(Actions.changeEvaluationStep(articleShow.currentStep + 1));
    }
  };

  private goToPrevStep = () => {
    const { dispatch, articleShow } = this.props;

    if (articleShow.currentStep !== ARTICLE_REVIEW_STEP.FIRST) {
      dispatch(Actions.changeEvaluationStep(articleShow.currentStep - 1));
    }
  };

  private handleClickScore = (step: ARTICLE_REVIEW_STEP, score: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeEvaluationScore(step, score));
  };

  private handleReviewChange = (review: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeReviewInput(review));
  };

  private handlePeerEvaluationCommentSubmit = (params: IPostCommentParams) => {
    const { dispatch } = this.props;
    const { comment, articleId, reviewId } = params;

    dispatch(
      Actions.handlePeerEvaluationCommentSubmit({
        comment,
        articleId,
        reviewId,
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
        sort: "createdAt,desc",
      }),
    );
  };

  private fetchComments = (articleId: number, reviewId: number, page?: number) => {
    const { dispatch } = this.props;

    const CancelToken = axios.CancelToken;
    this.commentsCancelTokenSource = CancelToken.source();

    dispatch(
      Actions.getComments({
        articleId,
        reviewId,
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

  private handleOpenAuthorList = () => {
    const { dispatch } = this.props;

    dispatch(Actions.openAuthorList());
  };

  private MakeScorllGoToEvaluateSection = () => {
    const positionInformation = this.evaluateWrapperNode.getBoundingClientRect();
    const targetHeight = positionInformation.top + window.pageYOffset - NAVBAR_HEIGHT;

    window.scrollTo(0, targetHeight);
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
    if (!article && !articleShow.isLoading) {
      return null;
    } else if (!article && articleShow.isLoading) {
      return <div>Loading... </div>;
    } else {
      const { type, summary, authors, createdAt, createdBy, link, source, title, note } = article;

      return (
        <div className={styles.articleShowContainer}>
          <div className={styles.articleContentContainer}>
            <Type tag={type} />
            <div className={styles.title}>{title}</div>
            <ArticleInfo from={source} createdAt={moment(createdAt).format("ll")} createdBy={createdBy} />
            <AuthorList
              authors={authors}
              isAuthorListOpen={articleShow.isAuthorListOpen}
              openAuthorList={this.handleOpenAuthorList}
            />
            <Abstract content={summary} />
            <ArticleNote note={note} />
            <Article link={link} />
            <div ref={el => (this.evaluateWrapperNode = el)}>
              <ArticleReview
                currentUser={currentUser}
                reviews={evaluations}
                articleShow={articleShow}
                article={article}
                comments={comments}
                commentsState={articleShow.commentStates}
                handleClickScore={this.handleClickScore}
                goToNextStep={this.goToNextStep}
                goToPrevStep={this.goToPrevStep}
                fetchComments={this.fetchComments}
                handleSubmitReview={this.handleSubmitEvaluation}
                handleTogglePeerReview={this.handleTogglePeerEvaluation}
                handlePeerReviewCommentSubmit={this.handlePeerEvaluationCommentSubmit}
                handleVotePeerReview={this.handleVotePeerEvaluation}
                handleReviewChange={this.handleReviewChange}
              />
            </div>
          </div>
          <div className={styles.evaluationSummaryContainer}>
            <EvaluateSummary article={article} MakeScorllGoToEvaluateSection={this.MakeScorllGoToEvaluateSection} />
          </div>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps)(ArticleShow);
