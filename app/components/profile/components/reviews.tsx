import * as React from "react";
import InfiniteScroll = require("react-infinite-scroller");
import { IProfileStateRecord } from "../records";
import ArticleSpinner from "../../common/spinner/articleSpinner";
import { IReviewsRecord } from "../../../model/review";
import ProfileEmptyContent from "./noContent";
import ProfileReviewItem from "./reviewItem";
import { ICurrentUserRecord } from "../../../model/currentUser";
import { IArticlesRecord } from "../../../model/article";
const styles = require("./reviews.scss");

interface IProfileReviewsProps {
  userId: number;
  articles: IArticlesRecord;
  currentUser: ICurrentUserRecord;
  profileState: IProfileStateRecord;
  reviews: IReviewsRecord;
  fetchReviews: (userId: number) => void;
  cancelFetchingFunction: () => void;
  clearFunction: () => void;
  handleVotePeerReview: (articleId: number, reviewId: number) => void;
}

class ProfileReviews extends React.PureComponent<IProfileReviewsProps, {}> {
  private mapReviewsNode = () => {
    const { articles, handleVotePeerReview, userId, currentUser, profileState, reviews, fetchReviews } = this.props;

    if (profileState.fetchingContentLoading) {
      return <ArticleSpinner className={styles.spinnerWrapper} />;
    } else if (!reviews || reviews.isEmpty() || !articles || articles.isEmpty()) {
      return <ProfileEmptyContent type="review" />;
    } else {
      const reviewNodes = reviews.map(review => {
        const article = articles.find(article => article.id === review.articleId);
        return (
          <ProfileReviewItem
            article={article}
            currentUser={currentUser}
            handleVotePeerReview={handleVotePeerReview}
            review={review}
            key={`profile_review_${review.id}`}
          />
        );
      });

      return (
        <InfiniteScroll
          pageStart={0}
          threshold={400}
          loadMore={() => {
            fetchReviews(userId);
          }}
          hasMore={!profileState.reviewListIsEnd}
          loader={<ArticleSpinner className={styles.spinnerWrapper} />}
          initialLoad={false}
        >
          {reviewNodes}
        </InfiniteScroll>
      );
    }
  };

  public componentDidMount() {
    const { userId, fetchReviews } = this.props;
    fetchReviews(userId);
  }

  public componentWillReceiveProps(nextProps: IProfileReviewsProps) {
    if (this.props.userId !== nextProps.userId) {
      this.props.cancelFetchingFunction();
      this.props.clearFunction();
      this.props.fetchReviews(nextProps.userId);
    }
  }

  public componentWillUnmount() {
    this.props.cancelFetchingFunction();
    this.props.clearFunction();
  }

  public render() {
    return <div className={styles.profileReviewWrapper}>{this.mapReviewsNode()}</div>;
  }
}

export default ProfileReviews;
