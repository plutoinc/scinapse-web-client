import * as React from "react";
import * as moment from "moment";
import { ICommentRecord } from "../../../../model/comment";
import Icon from "../../../../icons";
import EvaluationCommentInput, { IEvaluationCommentInputProps } from "./commentInput";
const styles = require("./comments.scss");

export interface IEvaluationCommentsProps extends IEvaluationCommentInputProps {}

function mapCommentNode(comment: ICommentRecord, index: number) {
  // TODO: Change below key to comment id
  return (
    <div key={comment.comment + index} className={styles.commentWrapper}>
      <div className={styles.authorInformation}>
        {/* <RoundImage width={34} height={34} /> */}
        <Icon className={styles.avatarIcon} icon="AVATAR" />
        <span className={styles.authorName}>{comment.createdBy.fullName}</span>
      </div>
      <div className={styles.commentArea}>{comment.comment}</div>
      <div className={styles.commentedAt}>{moment(comment.createdAt).fromNow()}</div>
    </div>
  );
}

const EvaluationComments = (props: IEvaluationCommentsProps) => {
  const commentsNode = props.evaluation.comments.map(mapCommentNode);

  return (
    <div className={styles.commentsWrapper}>
      {commentsNode}
      <EvaluationCommentInput
        currentUser={props.currentUser}
        evaluation={props.evaluation}
        handlePeerEvaluationCommentSubmit={props.handlePeerEvaluationCommentSubmit}
      />
    </div>
  );
};

export default EvaluationComments;
