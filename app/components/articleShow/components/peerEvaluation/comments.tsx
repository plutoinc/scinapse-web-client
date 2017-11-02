import * as React from "react";
import * as moment from "moment";
import { Link } from "react-router-dom";
import { ICommentRecord, ICommentsRecord } from "../../../../model/comment";
import EvaluationCommentInput, { IEvaluationCommentInputProps } from "./commentInput";
import UserProfileIcon from "../../../common/userProfileIcon";
const styles = require("./comments.scss");

export interface IEvaluationCommentsProps extends IEvaluationCommentInputProps {
  comments: ICommentsRecord;
}

function mapCommentNode(comment: ICommentRecord) {
  return (
    <div key={comment.id} className={styles.commentWrapper}>
      <Link to={`/users/${comment.createdBy.id}`} style={{ display: "body" }} className={styles.authorInformation}>
        <UserProfileIcon profileImage={comment.createdBy.profileImage} userId={comment.createdBy.id} type="small" />
        <span className={styles.authorName}>{comment.createdBy.name}</span>
      </Link>
      <div className={styles.commentArea}>{comment.comment}</div>
      <div className={styles.commentedAt}>{moment(comment.createdAt).fromNow()}</div>
    </div>
  );
}

const EvaluationComments = (props: IEvaluationCommentsProps) => {
  const commentsNode = props.comments.map(mapCommentNode);

  return (
    <div className={styles.commentsWrapper}>
      {commentsNode}
      <EvaluationCommentInput
        currentUser={props.currentUser}
        evaluation={props.evaluation}
        handlePeerEvaluationCommentSubmit={props.handlePeerEvaluationCommentSubmit}
        inputContainerStyle={props.inputContainerStyle}
      />
    </div>
  );
};

export default EvaluationComments;
