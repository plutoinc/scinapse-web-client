import * as React from "react";
import { List } from "immutable";
import { IPaperCommentRecord } from "../../../../model/paperComment";
import { ICurrentUserRecord } from "../../../../model/currentUser";
import Comment from "./comment";
import ButtonSpinner from "../../../common/spinner/buttonSpinner";
const styles = require("./comments.scss");

export interface ICommentsProps {
  comments: List<IPaperCommentRecord>;
  isCommentsOpen: boolean;
  currentUser: ICurrentUserRecord;
  deleteComment: (commentId: number) => void;
  commentCount: number;
  getMoreComments: () => void;
  isPageLoading: boolean;
}

function getMoreCommentsButton(props: ICommentsProps) {
  if (props.isPageLoading) {
    return (
      <div className={`${styles.moreButton} ${styles.isLoading}`}>
        <ButtonSpinner className={styles.buttonSpinner} />
        More Comments
      </div>
    );
  } else {
    return (
      <div onClick={props.getMoreComments} className={styles.moreButton}>
        More Comments
      </div>
    );
  }
}

const Comments = (props: ICommentsProps) => {
  const { currentUser, deleteComment } = props;

  if (props.comments.size === 0) {
    return null;
  } else if (props.comments.size > 2 && !props.isCommentsOpen) {
    let commentItems;

    props.comments.withMutations(currentComments => {
      commentItems = currentComments.slice(0, 2).map(comment => {
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
    });

    return <div className={styles.comments}>{commentItems}</div>;
  } else {
    let commentItems;

    props.comments.withMutations(currentComments => {
      commentItems = currentComments.map(comment => {
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
    });

    if (props.commentCount === props.comments.size) {
      return <div className={styles.comments}>{commentItems}</div>;
    } else {
      return (
        <div className={styles.comments}>
          {commentItems}
          {getMoreCommentsButton(props)}
        </div>
      );
    }
  }
};

export default Comments;
