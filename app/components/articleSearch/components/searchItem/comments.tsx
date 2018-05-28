import * as React from "react";
import { List } from "immutable";
import { ICommentRecord } from "../../../../model/comment";
import { CurrentUserRecord } from "../../../../model/currentUser";
import Comment from "./comment";
import ButtonSpinner from "../../../common/spinner/buttonSpinner";
import { withStyles } from "../../../../helpers/withStylesHelper";
import { MINIMUM_SHOWING_COMMENT_NUMBER } from ".";
const styles = require("./comments.scss");

export interface CommentsProps {
  comments: List<ICommentRecord | undefined>;
  isCommentsOpen: boolean;
  currentUser: CurrentUserRecord;
  isEnd: boolean;
  getMoreComments: () => void;
  handleRemoveComment: (targetComment: ICommentRecord) => void;
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
    const { comments, isCommentsOpen, currentUser, isEnd, handleRemoveComment } = this.props;

    if (comments.size === 0) {
      return null;
    }

    const isCommentsSameLessThanMinimumShowingCommentNumber = comments.size <= MINIMUM_SHOWING_COMMENT_NUMBER;
    if (isCommentsSameLessThanMinimumShowingCommentNumber) {
      const commentItems = comments.map((comment: ICommentRecord) => {
        return (
          <Comment
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
      const commentItems = comments.slice(0, MINIMUM_SHOWING_COMMENT_NUMBER).map((comment: ICommentRecord) => {
        return (
          <Comment
            key={`paper_comment_${comment.id}`}
            id={comment.id}
            comment={comment}
            isMine={currentUser.id === comment.createdBy!.id}
            handleRemoveComment={handleRemoveComment}
          />
        );
      });

      return <div className={styles.comments}>{commentItems}</div>;
    } else if (!isCommentsSameLessThanMinimumShowingCommentNumber && isCommentsOpen) {
      const commentItems = comments.map((comment: ICommentRecord) => {
        return (
          <Comment
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
