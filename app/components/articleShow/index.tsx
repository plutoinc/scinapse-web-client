import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import * as moment from "moment";
import { IAppState } from "../../reducers";
import { ICurrentUserStateRecord } from "../../model/currentUser";
import TagList from "./components/tagList";
import ArticleInfo from "./components/articleInfo";
import AuthorList from "./components/authorList";
import Abstract from "./components/abstract";
import Article from "./components/article";
import ArticleEvaluate from "./components/evaluate";
import { IArticleShowStateRecord, ARTICLE_EVALUATION_STEP } from "./records";
import * as Actions from "./actions";
import { IArticleRecord, ARTICLE_INITIAL_STATE } from "../../model/article";

const styles = require("./articleShow.scss");

interface IArticlePageParams {
  articleId?: number;
}

interface IArticleShowProps extends RouteComponentProps<IArticlePageParams>, DispatchProp<any> {
  currentUser: ICurrentUserStateRecord;
  articleShow: IArticleShowStateRecord;
  article: IArticleRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    currentUser: state.currentUser,
    articleShow: state.articleShow,
    article: state.article,
  };
}

@withRouter
class ArticleShow extends React.PureComponent<IArticleShowProps, {}> {
  private handleSubmitEvaluation = () => {
    const { dispatch, articleShow } = this.props;

    dispatch(
      Actions.submitEvaluation({
        originalityScore: articleShow.myOriginalityScore,
        originalityComment: articleShow.myOriginalityComment,
        contributionScore: articleShow.myContributionScore,
        contributionComment: articleShow.myContributionComment,
        analysisScore: articleShow.myAnalysisScore,
        analysisComment: articleShow.myAnalysisComment,
        expressivenessScore: articleShow.myExpressivenessScore,
        expressivenessComment: articleShow.myExpressivenessComment,
      }),
    );
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

  public componentDidMount() {
    const { match, dispatch } = this.props;
    const { articleId } = match.params;

    if (match.params.articleId) {
      dispatch(Actions.getArticle(articleId));
    }
  }

  public render() {
    const { article, articleShow } = this.props;
    if (articleShow.isLoading || article === ARTICLE_INITIAL_STATE) {
      return <div>Loading... </div>;
    } else {
      const { abstract, authors, createdAt, createdBy, link, source, title } = article;
      const mockTags = ["Open Access Paper", "CAU Paper"];

      return (
        <div className={styles.articleShowContainer}>
          <div className={styles.articleContentContainer}>
            <TagList tags={mockTags} />
            <div className={styles.title}>{title}</div>
            <ArticleInfo from={source} createdAt={moment(createdAt).format("ll")} createdBy={createdBy} />
            <AuthorList authors={authors} />
            <Abstract content={abstract} />
            <Article link={link} />
            <ArticleEvaluate
              articleShow={articleShow}
              handleClickScore={this.handleClickScore}
              handleEvaluationTabChange={this.handleEvaluationTabChange}
              handleClickStepButton={this.handleClickStepButton}
              handleEvaluationChange={this.handleEvaluationChange}
              goToNextStep={this.goToNextStep}
              handleSubmitEvaluation={this.handleSubmitEvaluation}
            />
          </div>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps)(ArticleShow);
