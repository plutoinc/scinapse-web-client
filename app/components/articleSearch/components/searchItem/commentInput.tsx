import * as React from "react";
import Icon from "../../../../icons/index";
import { InputBox } from "../../../common/inputBox/inputBox";
import ButtonSpinner from "../../../common/spinner/buttonSpinner";
const styles = require("./commentInput.scss");

export interface ICommentInputProps {
  isCommentsOpen: Boolean;
  commentCount: number;
  checkAuthDialog: () => void;
  commentInput: string;
  changeCommentInput: (commentInput: string) => void;
  toggleComments: () => void;
  handleCommentPost: () => void;
  isLoading: Boolean;
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
      <button onClick={props.handleCommentPost} className={styles.submitButton} disabled={props.commentInput === ""}>
        Post
      </button>
    );
  }
}

const CommentInput = (props: ICommentInputProps) => {
  return (
    <div className={styles.commentInputContainer}>
      <div
        onClick={props.toggleComments}
        className={props.isCommentsOpen ? `${styles.commentsButton} ${styles.isOpen}` : styles.commentsButton}
      >
        <Icon className={styles.commentIconWrapper} icon="COMMENT_ICON" />
        <span className={styles.commentsTitle}>Comments</span>
        <span className={styles.commentsCount}>{props.commentCount}</span>
      </div>
      <div className={styles.rightBox}>
        <InputBox
          onFocusFunc={props.checkAuthDialog}
          onChangeFunc={props.changeCommentInput}
          defaultValue={props.commentInput}
          placeHolder="Leave your comments about this paper"
          type="comment"
          className={styles.inputBox}
        />
        {getPostButton(props)}
      </div>
    </div>
  );
};

export default CommentInput;
