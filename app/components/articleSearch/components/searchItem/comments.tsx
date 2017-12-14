import * as React from "react";
import { List } from "immutable";
import { IPaperCommentRecord } from "../../../../model/paperComment";
import { ICurrentUserRecord } from "../../../../model/currentUser";

import Comment from "./comment";
const styles = require("./comments.scss");

export interface ICommentsProps {
  comments: List<IPaperCommentRecord>;
  isCommentsOpen: Boolean;
  currentUser: ICurrentUserRecord;
  deleteComment: (commentId: number) => void;
}

const Comments = (props: ICommentsProps) => {
  const { currentUser, deleteComment } = props;

  if (props.comments.size === 0) {
    return null;
  } else if (props.comments.size > 2 && !props.isCommentsOpen) {
    const commentItems = props.comments
      .slice(props.comments.size - 2, props.comments.size)
      .reverse()
      .map(comment => {
        return (
          <Comment
            key={`paper_comment_${comment.id}`}
            id={comment.id}
            comment={comment}
            isMine={currentUser.id === comment.createdBy.id}
            deleteComment={() => {
              deleteComment(comment.id);
            }}
          />
        );
      });

    return <div className={styles.comments}>{commentItems}</div>;
  } else {
    const commentItems = props.comments.reverse().map(comment => {
      return (
        <Comment
          key={`paper_comment_${comment.id}`}
          id={comment.id}
          comment={comment}
          isMine={currentUser.id === comment.createdBy.id}
          deleteComment={() => {
            deleteComment(comment.id);
          }}
        />
      );
    });

    return <div className={styles.comments}>{commentItems}</div>;
  }
};

export default Comments;
