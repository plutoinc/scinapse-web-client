import * as React from "react";
import * as moment from "moment";
import { List } from "immutable";
import { ICommentRecord } from "../../../../model/comment";
import Icon from "../../../../icons";
const styles = require("./comments.scss");

export interface IEvaluationCommentsProps {
  comments: List<ICommentRecord>;
}

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
  const commentsNode = props.comments.map(mapCommentNode);

  return <div className={styles.commentsWrapper}>{commentsNode}</div>;
};

export default EvaluationComments;
