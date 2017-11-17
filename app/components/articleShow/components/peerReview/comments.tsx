import * as React from "react";
import * as moment from "moment";
import { Link } from "react-router-dom";
import { ICommentRecord, ICommentsRecord } from "../../../../model/comment";
import ReviewCommentInput, { IReviewCommentInputProps } from "./commentInput";
import UserProfileIcon from "../../../common/userProfileIcon";
import { trackAction } from "../../../../helpers/handleGA";
const styles = require("./comments.scss");

export interface IReviewCommentsProps extends IReviewCommentInputProps {
  comments: ICommentsRecord;
}

function mapCommentNode(comment: ICommentRecord) {
  return (
    <div key={comment.id} className={styles.commentWrapper}>
      <Link
        to={`/users/${comment.createdBy.id}`}
        onClick={() => trackAction(`/users/${comment.createdBy.id}`, "mapCommentNode")}
        style={{ display: "body" }}
        className={styles.authorInformation}
      >
        <UserProfileIcon profileImage={comment.createdBy.profileImage} userId={comment.createdBy.id} type="small" />
        <span className={styles.authorName}>{comment.createdBy.name}</span>
      </Link>
      <div className={styles.commentArea}>{comment.comment}</div>
      <div className={styles.commentedAt}>{moment(comment.createdAt).fromNow()}</div>
    </div>
  );
}

const ReviewComments = (props: IReviewCommentsProps) => {
  const commentsNode = props.comments.map(mapCommentNode);

  return (
    <div className={styles.commentsWrapper}>
      {commentsNode}
      <ReviewCommentInput
        currentUser={props.currentUser}
        review={props.review}
        handlePeerReviewCommentSubmit={props.handlePeerReviewCommentSubmit}
        inputContainerStyle={props.inputContainerStyle}
      />
    </div>
  );
};

export default ReviewComments;
