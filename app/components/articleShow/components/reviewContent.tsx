import * as React from "react";
const styles = require("./reviewContent.scss");

interface IReviewContentProps {
  review: string;
}

const ReviewContent = (props: IReviewContentProps) => {
  const { review } = props;

  return <div className={styles.content}>{review}</div>;
};

export default ReviewContent;
