import * as React from "react";
import * as moment from "moment";
import { Link } from "react-router-dom";
import { ICommentRecord, ICommentsRecord } from "../../../../model/comment";
import Icon from "../../../../icons";
import EvaluationCommentInput, { IEvaluationCommentInputProps } from "./commentInput";
const styles = require("./comments.scss");

export interface IEvaluationCommentsProps extends IEvaluationCommentInputProps {
  comments: ICommentsRecord;
}

function mapCommentNode(comment: ICommentRecord) {
  return (
    <div key={comment.id} className={styles.commentWrapper}>
      <Link to={`/users/${comment.createdBy.id}`} style={{ display: "body" }} className={styles.authorInformation}>
        {/* <RoundImage width={34} height={34} /> */}
        <Icon className={styles.avatarIcon} icon="AVATAR" />
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
        handleOpenSignInDialog={props.handleOpenSignInDialog}
      />
    </div>
  );
};

export default EvaluationComments;
