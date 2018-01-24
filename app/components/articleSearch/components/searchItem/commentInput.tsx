import * as React from "react";
import Icon from "../../../../icons";
import ButtonSpinner from "../../../common/spinner/buttonSpinner";
import { MINIMUM_SHOWING_COMMENT_NUMBER } from "./comments";
import AutoSizeTextarea from "../../../common/autoSizeTextarea";

const styles = require("./commentInput.scss");

export interface ICommentInputProps {
  isCommentsOpen: boolean;
  checkAuthDialog: () => void;
  commentInput: string;
  changeCommentInput: (commentInput: string) => void;
  toggleComments: () => void;
  handlePostComment: () => void;
  isLoading: boolean;
  commentCount: number;
}

const CommentInput = (props: ICommentInputProps) => {
  const { commentCount, toggleComments, checkAuthDialog, changeCommentInput, isLoading, commentInput } = props;

  return (
    <div className={styles.commentInputContainer}>
      <div
        onClick={() => {
          if (commentCount > MINIMUM_SHOWING_COMMENT_NUMBER) toggleComments();
        }}
        className={styles.commentsButton}
      >
        <span className={styles.commentsTitle}>Comments</span>
        <span className={styles.commentsCount}>{commentCount}</span>
        {getCommentIcon(props)}
      </div>
      <div className={styles.rightBox}>
        <AutoSizeTextarea
          onFocusFunc={checkAuthDialog}
          onChangeFunc={changeCommentInput}
          onKeyDownFunc={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            commentInputBoxKeyDownFunc(e, props);
          }}
          disabled={isLoading}
          defaultValue={commentInput}
          placeHolder="Leave your comments about this paper"
          type="comment"
        />
        {getPostButton(props)}
      </div>
    </div>
  );
};

function getCommentIcon(props: ICommentInputProps) {
  let iconName;
  if (props.isCommentsOpen) {
    iconName = "COMMENTS_CLOSE";
  } else {
    iconName = "COMMENTS_OPEN";
  }

  return <Icon className={styles.commentIconWrapper} icon={iconName} />;
}

function commentInputBoxKeyDownFunc(e: React.KeyboardEvent<HTMLTextAreaElement>, props: ICommentInputProps) {
  if (e.ctrlKey && e.which === 13) {
    props.handlePostComment();
  }
}

function getPostButton(props: ICommentInputProps) {
  if (props.isLoading) {
    return (
      <div className={styles.loadingSubmitButton}>
        <ButtonSpinner className={styles.buttonSpinner} />
        Post
      </div>
    );
  } else {
    return (
      <button onClick={props.handlePostComment} className={styles.submitButton} disabled={props.commentInput === ""}>
        Post
      </button>
    );
  }
}

export default CommentInput;
