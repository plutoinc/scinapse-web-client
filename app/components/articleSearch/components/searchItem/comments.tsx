import * as React from "react";
import { List } from "immutable";
import { ICommentRecord } from "../../../../model/comment";
const styles = require("./comments.scss");

export interface ICommentsProps {
  comments: List<ICommentRecord>;
  isCommentsOpen: Boolean;
}

const Comments = (props: ICommentsProps) => {
  if (props.comments.size === 0) {
    return null;
  } else if (props.comments.size > 2 && !props.isCommentsOpen) {
    const commentItems = props.comments.slice(0, 2).map((comment, index) => {
      return (
        <div className={styles.comment} key={`search_comment_${index}`}>
          <div className={styles.authorInfo}>
            <div className={styles.author}>{comment.createdBy.name}</div>
            <div className={styles.institution}>{comment.createdBy.institution}</div>
          </div>
          <div className={styles.commentContent}>{comment.comment}</div>
        </div>
      );
    });

    return <div className={styles.comments}>{commentItems}</div>;
  } else {
    const commentItems = props.comments.map((comment, index) => {
      return (
        <div className={styles.comment} key={`search_comment_${index}`}>
          <div className={styles.authorInfo}>
            <div className={styles.author}>{comment.createdBy.name}</div>
            <div className={styles.institution}>{comment.createdBy.institution}</div>
          </div>
          <div className={styles.commentContent}>{comment.comment}</div>
        </div>
      );
    });

    return <div className={styles.comments}>{commentItems}</div>;
  }
};

export default Comments;
