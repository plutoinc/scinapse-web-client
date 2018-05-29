import * as React from "react";
import CommentAPI from "../../../../api/comment";
import Icon from "../../../../icons";
import ButtonSpinner from "../../../common/spinner/buttonSpinner";
import AutoSizeTextarea from "../../../common/autoSizeTextarea";
import { withStyles } from "../../../../helpers/withStylesHelper";
import alertToast from "../../../../helpers/makePlutoToastAction";
import { Comment } from "../../../../model/comment";
const styles = require("./commentInput.scss");

export interface CommentInputProps {
  checkAuthDialog: () => void;
  handleClickCommentCount: () => void;
  checkVerifiedUser: () => boolean;
  handleAddingNewComment: (comment: Comment) => void;
  isCommentsOpen: boolean;
  commentCount: number;
  paperId: number;
}

interface CommentInputStates {
  commentInput: string;
  isPostingComment: boolean;
}

class CommentInput extends React.PureComponent<CommentInputProps, CommentInputStates> {
  public constructor(props: CommentInputProps) {
    super(props);

    this.state = {
      commentInput: "",
      isPostingComment: false,
    };
  }

  public render() {
    const { commentCount, checkAuthDialog, handleClickCommentCount } = this.props;
    const { commentInput, isPostingComment } = this.state;

    return (
      <div className={styles.commentInputContainer}>
        <div onClick={handleClickCommentCount} className={styles.commentsButton}>
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
            disabled={isPostingComment}
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

    return <Icon className={styles.commentIconWrapper} icon={isCommentsOpen ? "COMMENTS_CLOSE" : "COMMENTS_OPEN"} />;
  };

  private commentInputBoxKeyDownFunc = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.which === 13) {
      this.handlePostComment();
    }
  };

  private getPostButton = () => {
    const { commentInput, isPostingComment } = this.state;

    if (isPostingComment) {
      return (
        <div className={styles.loadingSubmitButton}>
          <ButtonSpinner className={styles.buttonSpinner} />
          Post
        </div>
      );
    } else {
      return (
        <button onClick={this.handlePostComment} className={styles.submitButton} disabled={commentInput === ""}>
          Post
        </button>
      );
    }
  };

  private handlePostComment = async () => {
    const { checkVerifiedUser, paperId } = this.props;
    const { commentInput } = this.state;

    const trimmedComment = commentInput.trim();

    if (checkVerifiedUser()) {
      this.setState({
        isPostingComment: true,
      });
      try {
        const newComment = await CommentAPI.postComment({
          paperId,
          comment: trimmedComment,
        });

        this.setState({
          commentInput: "",
          isPostingComment: false,
        });

        console.log(newComment);
        // TODO: ENABLE THIS
        // handleAddingNewComment(newComment);
      } catch (err) {
        alertToast({
          type: "error",
          message: "Sorry. Failed to post comment.",
        });
        this.setState({
          isPostingComment: false,
        });
      }
    }
  };
}

export default withStyles<typeof CommentInput>(styles)(CommentInput);
