import * as React from "react";
import * as moment from "moment";
import { Link } from "react-router-dom";
import { ICurrentUserRecord } from "../../../model/currentUser";
import { IReviewRecord } from "../../../model/review";
import ReviewUserInformation from "../../articleShow/components/reviewUserInformation";
import Icon from "../../../icons/";
import { IArticleRecord } from "../../../model/article";
import { trackAction } from "../../../helpers/handleGA";
const shave = require("shave").default;
const styles = require("./reviewItem.scss");

interface IProfileReviewItemProps {
  currentUser: ICurrentUserRecord;
  review: IReviewRecord;
  article: IArticleRecord;
  handleVotePeerReview: (articleId: number, reviewId: number) => void;
}

class ProfileReviewItem extends React.PureComponent<IProfileReviewItemProps, {}> {
  private summaryElement: HTMLDivElement;

  private shaveTexts() {
    if (!!this.summaryElement) {
      shave(this.summaryElement, 40);
    }
  }

  private getStarIcon = () => {
    const { review, handleVotePeerReview } = this.props;

    if (review.voted) {
      return <Icon className={styles.starIcon} icon="STAR" />;
    } else {
      return (
        <span
          onClick={() => {
            handleVotePeerReview(review.articleId, review.id);
          }}
          style={{ cursor: "pointer" }}
          className={styles.starIcon}
        >
          <Icon icon="EMPTY_STAR" />
        </span>
      );
    }
  };

  private getReviewBox = () => {
    const { review } = this.props;

    return (
      <div className={styles.closedHeader}>
        <ReviewUserInformation className={styles.headerLeftBox} user={review.createdBy} />
        <div className={styles.headerRightBox}>
          <span className={styles.scoreBox}>
            <span className={styles.scoreItem}>{review.point.originality}</span>
            <span className={styles.scoreItem}>{review.point.significance}</span>
            <span className={styles.scoreItem}>{review.point.validity}</span>
            <span className={styles.scoreItem}>{review.point.organization}</span>
            <span className={styles.scoreItem}>{review.point.total}</span>
          </span>
          <span className={styles.actionItemsWrapper}>
            {this.getStarIcon()}
            <span className={styles.rightItem}>{review.vote}</span>
            <Icon className={styles.commentIcon} icon="COMMENT" />
            <span className={styles.rightItem}>{review.commentSize}</span>
          </span>
          <Link
            to={`/articles/${review.articleId}`}
            onClick={() => trackAction(`/articles/${review.articleId}`, "profileReviewItem")}
            className={styles.toggleButtonWrapper}
          >
            <Icon className={styles.toggleButton} icon="OPEN_ARTICLE_REVIEW" />
          </Link>
        </div>
      </div>
    );
  };

  public componentDidMount() {
    this.shaveTexts();
  }

  public render() {
    const { article, review } = this.props;

    if (!article || !review || article.isEmpty() || review.isEmpty()) {
      return null;
    }

    return (
      <div className={styles.reviewItem}>
        <div className={styles.articleInformationWrapper}>
          <Link
            to={`/articles/${article.id}`}
            onClick={() => trackAction(`/articles/${article.id}`, "profileReviewItemTitle")}
            className={styles.articleTitle}
          >
            {article.title}
          </Link>
          <div className={styles.articleInformation}>
            <span>{`posted by `}</span>
            <Link
              to={`/users/${article.createdBy.id}`}
              onClick={() => trackAction(`/users/${article.createdBy.id}`, "profileReviewItemCreatedBy")}
            >
              {article.createdBy.name}
            </Link>
            <span>{`  |  posted at ${moment(article.createdAt).format("ll")}`}</span>
          </div>
          <Link
            to={`/articles/${article.id}`}
            onClick={() => trackAction(`/articles/${article.id}`, "profileReviewItemArticleSummary")}
            style={{ display: "block" }}
          >
            <div ref={ele => (this.summaryElement = ele)} className={styles.articleSummary}>
              {article.summary}
            </div>
          </Link>
        </div>
        {this.getReviewBox()}
      </div>
    );
  }
}

export default ProfileReviewItem;
