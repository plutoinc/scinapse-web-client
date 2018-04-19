import * as React from "react";
import { List } from "immutable";
import { ICommentRecord } from "../../../../model/comment";
import { CurrentUserRecord } from "../../../../model/currentUser";
import Comment from "./comment";
import ButtonSpinner from "../../../common/spinner/buttonSpinner";
import { withStyles } from "../../../../helpers/withStylesHelper";
const styles = require("./comments.scss");

export const MINIMUM_SHOWING_COMMENT_NUMBER = 2;

export interface CommentsProps {
  comments: List<ICommentRecord>;
  isCommentsOpen: boolean;
  currentUser: CurrentUserRecord;
  deleteComment: (commentId: number) => void;
  commentCount: number;
  getMoreComments: () => void;
  isPageLoading: boolean;
}

function getMoreCommentsButton(props: CommentsProps) {
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

class Comments extends React.Component<CommentsProps, {}> {
  public shouldComponentUpdate(nextProps: CommentsProps) {
    if (
      nextProps.comments !== this.props.comments ||
      nextProps.isCommentsOpen !== this.props.isCommentsOpen ||
      nextProps.isPageLoading !== this.props.isPageLoading ||
      nextProps.commentCount !== this.props.commentCount
    ) {
      return true;
    } else {
      return false;
    }
  }

  public render() {
    const { comments, isCommentsOpen, currentUser, deleteComment, commentCount } = this.props;

    if (comments.size === 0) {
      return null;
    }

    const isCommentsSameLessThanMinimumShowingCommentNumber = comments.size <= MINIMUM_SHOWING_COMMENT_NUMBER;
    if (isCommentsSameLessThanMinimumShowingCommentNumber) {
      const commentItems = comments.map(comment => {
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
    } else if (!isCommentsOpen) {
      const commentItems = comments.slice(0, MINIMUM_SHOWING_COMMENT_NUMBER).map(comment => {
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
    } else if (!isCommentsSameLessThanMinimumShowingCommentNumber && isCommentsOpen) {
      const commentItems = comments.map(comment => {
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

      const isThereNoMoreComments = commentCount === comments.size;

      if (isThereNoMoreComments) {
        return <div className={styles.comments}>{commentItems}</div>;
      } else {
        return (
          <div className={styles.comments}>
            {commentItems}
            {getMoreCommentsButton(this.props)}
          </div>
        );
      }
    }
  }
}

export default withStyles<typeof Comments>(styles)(Comments);
