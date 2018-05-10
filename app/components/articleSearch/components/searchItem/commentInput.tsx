import * as React from "react";
import Icon from "../../../../icons";
import ButtonSpinner from "../../../common/spinner/buttonSpinner";
import { MINIMUM_SHOWING_COMMENT_NUMBER } from "./comments";
import AutoSizeTextarea from "../../../common/autoSizeTextarea";
import { withStyles } from "../../../../helpers/withStylesHelper";
const styles = require("./commentInput.scss");

export interface CommentInputProps {
  isCommentsOpen: boolean;
  checkAuthDialog: () => void;
  toggleComments: () => void;
  handlePostComment: () => void;
  isLoading: boolean;
  commentCount: number;
}

interface CommentInputStates {
  commentInput: string;
}

class CommentInput extends React.PureComponent<CommentInputProps, CommentInputStates> {
  public constructor(props: CommentInputProps) {
    super(props);

    this.state = {
      commentInput: "",
    };
  }

  public render() {
    const { commentCount, toggleComments, checkAuthDialog, isLoading } = this.props;
    const { commentInput } = this.state;

    return (
      <div className={styles.commentInputContainer}>
        <div
          onClick={() => {
            if (commentCount > MINIMUM_SHOWING_COMMENT_NUMBER) {
              toggleComments();
            }
          }}
          className={styles.commentsButton}
        >
          <span className={styles.commentsTitle}>Comments</span>
          <span className={styles.commentsCount}>{commentCount}</span>
          {this.getCommentIcon()}
        </div>
        <div className={styles.rightBox}>
          <AutoSizeTextarea
            wrapperClassName={styles.textAreaWrapper}
            textAreaClassName={styles.textArea}
            onFocusFunc={checkAuthDialog}
            onChange={this.changeCommentInput}
            onKeyDownFunc={this.commentInputBoxKeyDownFunc}
            disabled={isLoading}
            defaultValue={commentInput}
            placeHolder="Leave your comments about this paper"
          />
          {this.getPostButton()}
        </div>
      </div>
    );
  }

  private changeCommentInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      commentInput: e.currentTarget.value,
    });
  };

  private getCommentIcon = () => {
    const { isCommentsOpen } = this.props;

    let iconName;
    if (isCommentsOpen) {
      iconName = "COMMENTS_CLOSE";
    } else {
      iconName = "COMMENTS_OPEN";
    }

    return <Icon className={styles.commentIconWrapper} icon={iconName} />;
  };

  private commentInputBoxKeyDownFunc = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { handlePostComment } = this.props;

    if (e.ctrlKey && e.which === 13) {
      handlePostComment();
    }
  };

  private getPostButton = () => {
    const { isLoading, handlePostComment } = this.props;
    const { commentInput } = this.state;

    if (isLoading) {
      return (
        <div className={styles.loadingSubmitButton}>
          <ButtonSpinner className={styles.buttonSpinner} />
          Post
        </div>
      );
    } else {
      return (
        <button onClick={handlePostComment} className={styles.submitButton} disabled={commentInput === ""}>
          Post
        </button>
      );
    }
  };
}

export default withStyles<typeof CommentInput>(styles)(CommentInput);
