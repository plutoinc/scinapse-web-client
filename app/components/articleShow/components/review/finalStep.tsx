import * as React from "react";
import * as moment from "moment";
import { ICurrentUserRecord } from "../../../../model/currentUser";
// import RoundImage from "../../../common/roundImage";
import { IArticleShowStateRecord } from "../../records";
import ReviewUserInformation from "../reviewUserInformation";
import Icon from "../../../../icons";
import ReviewContent from "../reviewContent";
import { IReviewRecord } from "../../../../model/review";
const styles = require("./finalStep.scss");

export interface IReviewFinalStepProps {
  currentUser: ICurrentUserRecord;
  articleShow: IArticleShowStateRecord;
  review: IReviewRecord;
}

function getStarIcon(voted: boolean) {
  if (voted) {
    return <Icon className={styles.starIcon} icon="STAR" />;
  } else {
    return <Icon className={styles.starIcon} icon="EMPTY_STAR" />;
  }
}

function getHeader(props: IReviewFinalStepProps) {
  const { currentUser, review } = props;

  return (
    <div className={styles.header}>
      <ReviewUserInformation className={styles.headerLeftBox} user={currentUser} />
      <div className={styles.headerRightBox}>
        {getStarIcon(review.voted)}
        <span className={styles.rightItem}>{review.vote}</span>
        <Icon className={styles.commentIcon} icon="COMMENT" />
        <span className={styles.rightItem}>{review.commentSize}</span>
      </div>
    </div>
  );
}

function getFooter(props: IReviewFinalStepProps) {
  return (
    <div className={styles.footer}>
      <div className={styles.createdAt}>Reviewed at {moment(props.review.createdAt).fromNow()}</div>
    </div>
  );
}

const ReviewFinalStep = (props: IReviewFinalStepProps) => {
  const { review } = props;

  if (!review) {
    return null;
  }

  return (
    <div className={styles.contentWrapper}>
      {getHeader(props)}
      <ReviewContent review={review.point.review} />
      {getFooter(props)}
    </div>
  );
};

export default ReviewFinalStep;
