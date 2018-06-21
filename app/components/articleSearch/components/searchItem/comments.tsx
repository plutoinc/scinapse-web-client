import * as React from "react";
import { Comment } from "../../../../model/comment";
import { CurrentUser } from "../../../../model/currentUser";
import CommentItem from "./comment";
import ButtonSpinner from "../../../common/spinner/buttonSpinner";
import { withStyles } from "../../../../helpers/withStylesHelper";
import { MINIMUM_SHOWING_COMMENT_NUMBER } from ".";
const styles = require("./comments.scss");

export interface CommentsProps {
  comments: Comment[];
  isCommentsOpen: boolean;
  currentUser: CurrentUser;
  isEnd: boolean;
  getMoreComments: () => void;
  handleRemoveComment: (targetComment: Comment) => void;
  isFetchingComments: boolean;
}

function getMoreCommentsButton(props: CommentsProps) {
  if (props.isFetchingComments) {
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

class Comments extends React.PureComponent<CommentsProps, {}> {
  public render() {
    const {
      comments,
      isCommentsOpen,
      currentUser,
      isEnd,
      handleRemoveComment,
    } = this.props;

    if (!comments || comments.length === 0) {
      return null;
    }

    const isCommentsSameLessThanMinimumShowingCommentNumber =
      comments.length <= MINIMUM_SHOWING_COMMENT_NUMBER;
    if (isCommentsSameLessThanMinimumShowingCommentNumber) {
      const commentItems = comments.map((comment: Comment) => {
        return (
          <CommentItem
            key={`paper_comment_${comment.id}`}
            id={comment.id}
            comment={comment}
            isMine={currentUser.id === comment.createdBy!.id}
            handleRemoveComment={handleRemoveComment}
          />
        );
      });
      return <div className={styles.comments}>{commentItems}</div>;
    } else if (!isCommentsOpen) {
      const commentItems = comments
        .slice(0, MINIMUM_SHOWING_COMMENT_NUMBER)
        .map((comment: Comment) => {
          return (
            <CommentItem
              key={`paper_comment_${comment.id}`}
              id={comment.id}
              comment={comment}
              isMine={currentUser.id === comment.createdBy!.id}
              handleRemoveComment={handleRemoveComment}
            />
          );
        });

      return <div className={styles.comments}>{commentItems}</div>;
    } else if (
      !isCommentsSameLessThanMinimumShowingCommentNumber &&
      isCommentsOpen
    ) {
      const commentItems = comments.map((comment: Comment) => {
        return (
          <CommentItem
            key={`paper_comment_${comment.id}`}
            id={comment.id}
            comment={comment}
            isMine={currentUser.id === comment.createdBy!.id}
            handleRemoveComment={handleRemoveComment}
          />
        );
      });

      if (isEnd) {
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
