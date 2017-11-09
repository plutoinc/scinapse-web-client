import { List } from "immutable";
import * as React from "react";
import { IReviewsRecord } from "../../../../model/review";
import PeerReview from "../peerReview";
import { IPeerReviewProps } from "../peerReview";
import { IReviewCommentsState } from "../../records";
import Icon from "../../../../icons";
const styles = require("./peerReviewList.scss");

interface IPeerReviewListProps extends IPeerReviewProps {
  reviews: IReviewsRecord;
  commentsState: List<IReviewCommentsState>;
  fetchComments: (articleId: number, reviewId: number, page?: number) => void;
}

class PeerReviewList extends React.PureComponent<IPeerReviewListProps, {}> {
  private mapReviews() {
    const {
      handleVotePeerReview,
      handleUnVotePeerReview,
      handlePeerReviewCommentSubmit,
      articleShow,
      currentUser,
      comments,
      reviews,
      handleTogglePeerReview,
      commentsState,
    } = this.props;

    if (!reviews || reviews.isEmpty()) {
      return (
        <div className={styles.noReviewContainer}>
          <Icon className={styles.noReviewIconWrapper} icon="FOOTER_LOGO" />
          <div className={styles.noReviewContent}>There are no registered review yet.</div>
        </div>
      );
    }

    return reviews.map(review => {
      const commentState = commentsState.find(commentState => commentState.reviewId === review.id);
      const targetComments = comments.filter(comment => comment.reviewId === review.id).toList();

      return (
        <PeerReview
          comments={targetComments}
          commentState={commentState}
          key={review.id}
          review={review}
          handleTogglePeerReview={handleTogglePeerReview}
          currentUser={currentUser}
          articleShow={articleShow}
          handlePeerReviewCommentSubmit={handlePeerReviewCommentSubmit}
          handleVotePeerReview={handleVotePeerReview}
          handleUnVotePeerReview={handleUnVotePeerReview}
        />
      );
    });
  }

  public componentDidMount() {
    const { fetchComments, reviews } = this.props;

    reviews.forEach(review => {
      fetchComments(review.articleId, review.id, 0);
    });
  }

  public render() {
    return <div>{this.mapReviews()}</div>;
  }
}

export default PeerReviewList;
