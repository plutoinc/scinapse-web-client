import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import AutoSizeTextarea from "../../common/autoSizeTextarea";
import checkAuthDialog from "../../../helpers/checkAuthDialog";
import ButtonSpinner from "../../common/spinner/buttonSpinner";

const styles = require("./commentInput.scss");

export interface PaperShowCommentInputProps {
  commentInput: string;
  isPostingComment: boolean;
  isFailedToPostingComment: boolean;
  handlePostComment: () => void;
  handleChangeCommentInput: (comment: string) => void;
}

function getPostButton(props: PaperShowCommentInputProps) {
  if (props.isPostingComment) {
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

const PaperShowCommentInput = (props: PaperShowCommentInputProps) => {
  const { isPostingComment, commentInput, handleChangeCommentInput } = props;

  return (
    <div className={styles.inputBoxWrapper}>
      <AutoSizeTextarea
        wrapperClassName={styles.textAreaWrapper}
        textAreaClassName={styles.textArea}
        onFocusFunc={checkAuthDialog}
        onChangeFunc={handleChangeCommentInput}
        disabled={isPostingComment}
        defaultValue={commentInput}
        rows={4}
        placeHolder="Leave your comments about this paper"
      />
      <div className={styles.postButtonWrapper}>{getPostButton(props)}</div>
    </div>
  );
};

export default withStyles<typeof PaperShowCommentInput>(styles)(PaperShowCommentInput);
