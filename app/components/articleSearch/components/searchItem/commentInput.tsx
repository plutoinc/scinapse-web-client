import * as React from "react";
import Icon from "../../../../icons/index";
import { InputBox } from "../../../common/inputBox/inputBox";
import ButtonSpinner from "../../../common/spinner/buttonSpinner";
const styles = require("./commentInput.scss");

export interface ICommentInputProps {
  isCommentsOpen: boolean;
  checkAuthDialog: () => void;
  commentInput: string;
  changeCommentInput: (commentInput: string) => void;
  toggleComments: () => void;
  handleCommentPost: () => void;
  isLoading: boolean;
  commentCount: number;
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
    props.handleCommentPost();
  }
}

const CommentInput = (props: ICommentInputProps) => {
  return (
    <div className={styles.commentInputContainer}>
      <div
        onClick={() => {
          if (props.commentCount > 2) props.toggleComments();
        }}
        className={styles.commentsButton}
      >
        <span className={styles.commentsTitle}>Comments</span>
        <span className={styles.commentsCount}>{props.commentCount}</span>
        {getCommentIcon(props)}
      </div>
      <div className={styles.rightBox}>
        <InputBox
          onFocusFunc={props.checkAuthDialog}
          onChangeFunc={props.changeCommentInput}
          onKeyDownFunc={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            commentInputBoxKeyDownFunc(e, props);
          }}
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
