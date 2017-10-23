import * as React from "react";
import InfiniteScroll = require("react-infinite-scroller");
import { IProfileStateRecord } from "../records";
import ArticleSpinner from "../../common/spinner/articleSpinner";
import { IEvaluationsRecord } from "../../../model/evaluation";
import ProfileEmptyContent from "./noContent";
import ProfileEvaluationItem from "./evaluationItem";
import { ICurrentUserRecord } from "../../../model/currentUser";
import { IHandlePeerEvaluationCommentSubmitParams } from "../../articleShow/actions";
import { IArticlesRecord } from "../../../model/article";
const styles = require("./evaluations.scss");

interface IProfileEvaluationsProps {
  userId: number;
  articles: IArticlesRecord;
  currentUser: ICurrentUserRecord;
  profileState: IProfileStateRecord;
  evaluations: IEvaluationsRecord;
  fetchEvaluations: (userId: number) => void;
  cancelFetchingFunction: () => void;
  clearFunction: () => void;
  handleVotePeerEvaluation: (articleId: number, evaluationId: number) => void;
  handlePeerEvaluationCommentSubmit: (params: IHandlePeerEvaluationCommentSubmitParams) => void;
}

class ProfileEvaluations extends React.PureComponent<IProfileEvaluationsProps, {}> {
  private mapEvaluationsNode = () => {
    const {
      articles,
      handleVotePeerEvaluation,
      handlePeerEvaluationCommentSubmit,
      userId,
      currentUser,
      profileState,
      evaluations,
      fetchEvaluations,
    } = this.props;

    if (!evaluations || evaluations.isEmpty() || !articles || articles.isEmpty()) {
      return <ProfileEmptyContent type="evaluation" />;
    } else {
      const evaluationNodes = evaluations.map(evaluation => {
        const article = articles.find(article => article.id === evaluation.articleId);
        return (
          <ProfileEvaluationItem
            article={article}
            currentUser={currentUser}
            handleVotePeerEvaluation={handleVotePeerEvaluation}
            evaluation={evaluation}
            handlePeerEvaluationCommentSubmit={handlePeerEvaluationCommentSubmit}
            key={`profile_evaluation_${evaluation.id}`}
          />
        );
      });

      return (
        <InfiniteScroll
          pageStart={0}
          threshold={400}
          loadMore={() => {
            fetchEvaluations(userId);
          }}
          hasMore={!profileState.evaluationListIsEnd}
          loader={
            <div className={styles.spinnerWrapper}>
              <ArticleSpinner />
            </div>
          }
          initialLoad={false}
        >
          {evaluationNodes}
        </InfiniteScroll>
      );
    }
  };

  public componentDidMount() {
    const { userId, fetchEvaluations } = this.props;
    fetchEvaluations(userId);
  }

  public componentWillReceiveProps(nextProps: IProfileEvaluationsProps) {
    if (this.props.userId !== nextProps.userId) {
      this.props.cancelFetchingFunction();
      this.props.clearFunction();
      this.props.fetchEvaluations(this.props.userId);
    }
  }

  public componentWillUnmount() {
    this.props.cancelFetchingFunction();
    this.props.clearFunction();
  }

  public render() {
    return <div className={styles.profileEvaluationWrapper}>{this.mapEvaluationsNode()}</div>;
  }
}

export default ProfileEvaluations;
