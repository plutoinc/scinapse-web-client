import * as React from "react";
import * as moment from "moment";
import { ICurrentUserRecord } from "../../../../model/currentUser";
import { IArticleShowStateRecord, IReviewCommentsState } from "../../records";
import ReviewUserInformation from "../reviewUserInformation";
import Icon from "../../../../icons";
import ReviewContent from "../reviewContent";
import ReviewComments, { IReviewCommentsProps } from "./comments";
import ArticleSpinner from "../../../common/spinner/articleSpinner";
import Tooltip from "../../../common/tooltip/tooltip";
import checkAuthDialog from "../../../../helpers/checkAuthDialog";
const styles = require("./peerReview.scss");

export interface IPeerReviewProps extends IReviewCommentsProps {
  currentUser: ICurrentUserRecord;
  articleShow: IArticleShowStateRecord;
  commentState?: IReviewCommentsState;
  handleTogglePeerReview: (peerReviewId: number) => void;
  handleVotePeerReview: (articleId: number, reviewId: number) => void;
  handleUnVotePeerReview: (articleId: number, reviewId: number) => void;
  deleteReview: (reviewId: number) => void;
}

class PeerReview extends React.PureComponent<IPeerReviewProps, {}> {
  private getFooter = () => {
    const { review } = this.props;
    return (
      <div className={styles.footer}>
        <div className={styles.createdAt}>Reviewed at {moment(review.createdAt).fromNow()}</div>
      </div>
    );
  };

  private getReviewComments = () => {
    const { currentUser, review, handlePeerReviewCommentSubmit, comments, commentState } = this.props;

    if (commentState.isLoading) {
      return <ArticleSpinner />;
    } else {
      return (
        <ReviewComments
          comments={comments}
          handlePeerReviewCommentSubmit={handlePeerReviewCommentSubmit}
          currentUser={currentUser}
          review={review}
        />
      );
    }
  };

  private getOpenedBox = () => {
    const { review, handleTogglePeerReview } = this.props;

    return (
      <div className={styles.peerReviewComponent}>
        <div className={styles.peerReviewContainer}>
          <div className={styles.openedHeader}>
            <ReviewUserInformation className={styles.headerLeftBox} user={review.createdBy} />
            <div className={styles.headerRightBox}>
              {this.getScoreBox()}
              {this.getDeleteReviewButton()}
              <span className={styles.actionItemsWrapper}>
                {this.getStarIcon()}
                <span className={styles.rightItem}>{review.vote}</span>
                <Icon className={styles.commentIcon} icon="COMMENT" />
                <span className={styles.rightItem}>{review.commentSize}</span>
              </span>
              <span
                onClick={() => {
                  handleTogglePeerReview(review.id);
                }}
                className={styles.toggleButtonWrapper}
              >
                <Icon className={styles.toggleButton} icon="CLOSE_ARTICLE_REVIEW" />
              </span>
            </div>
          </div>
          <div className={styles.reviewContentWrapper}>
            <ReviewContent review={review.point.review || "There is no review"} />
            {this.getFooter()}
          </div>
        </div>
        {this.getReviewComments()}
      </div>
    );
  };

  private getDeleteReviewButton = () => {
    const { deleteReview, review, currentUser } = this.props;

    if (currentUser.id === review.createdBy.id) {
      return (
        <div
          onClick={() => {
            if (confirm("Do you want to delte this review?")) {
              deleteReview(review.id);
            }
          }}
        >
          test
        </div>
      );
    }
  };

  private getStarIcon = () => {
    const { review, handleVotePeerReview, handleUnVotePeerReview, currentUser } = this.props;

    if (currentUser.id === review.createdBy.id) {
      return <Icon className={styles.starIcon} icon="EMPTY_STAR" />;
    } else if (review.voted) {
      return (
        <span
          onClick={() => {
            checkAuthDialog();
            if (currentUser.isLoggedIn) {
              handleUnVotePeerReview(review.articleId, review.id);
            }
          }}
          style={{ cursor: "pointer" }}
          className={styles.starIcon}
        >
          <Icon icon="STAR" />
        </span>
      );
    } else {
      return (
        <span
          onClick={() => {
            checkAuthDialog();
            if (currentUser.isLoggedIn) {
              handleVotePeerReview(review.articleId, review.id);
            }
          }}
          style={{ cursor: "pointer" }}
          className={styles.starIcon}
        >
          <Icon icon="EMPTY_STAR" />
        </span>
      );
    }
  };

  private getScoreBox = () => {
    const { review } = this.props;

    return (
      <span className={styles.scoreBox}>
        <span className={styles.scoreItem}>
          <Tooltip className={styles.scoreItemTooltip} left={-20} top={-26} iconTop={-6} content={"Originality"} />
          {review.point.originality}
        </span>
        <span className={styles.scoreItem}>
          <Tooltip className={styles.scoreItemTooltip} left={-26} top={-26} iconTop={-6} content={"Significance"} />
          {review.point.significance}
        </span>
        <span className={styles.scoreItem}>
          <Tooltip className={styles.scoreItemTooltip} left={-14} top={-26} iconTop={-6} content={"Validity"} />
          {review.point.validity}
        </span>
        <span className={styles.scoreItem}>
          <Tooltip className={styles.scoreItemTooltip} left={-22} top={-26} iconTop={-6} content={"Organization"} />
          {review.point.organization}
        </span>
        <span className={styles.totalPoint}>{review.point.total}</span>
      </span>
    );
  };

  private getClosedBox = () => {
    const { review, handleTogglePeerReview } = this.props;

    return (
      <div className={styles.peerReviewComponent}>
        <div className={styles.closedHeader}>
          <ReviewUserInformation className={styles.headerLeftBox} user={review.createdBy} />
          <div className={styles.headerRightBox}>
            {this.getScoreBox()}
            {this.getDeleteReviewButton()}
            <span className={styles.actionItemsWrapper}>
              {this.getStarIcon()}
              <span className={styles.rightItem}>{review.vote}</span>
              <Icon className={styles.commentIcon} icon="COMMENT" />
              <span className={styles.rightItem}>{review.commentSize}</span>
            </span>
            <span
              onClick={() => {
                handleTogglePeerReview(review.id);
              }}
              className={styles.toggleButtonWrapper}
            >
              <Icon className={styles.toggleButton} icon="OPEN_ARTICLE_REVIEW" />
            </span>
          </div>
        </div>
      </div>
    );
  };

  public render() {
    const { commentState, articleShow, review } = this.props;
    if (!commentState) {
      return null;
    }

    if (articleShow.peerReviewId === review.id) {
      return this.getOpenedBox();
    } else {
      return this.getClosedBox();
    }
  }
}

export default PeerReview;
