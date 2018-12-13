import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import AutoSizeTextarea from "../../common/autoSizeTextarea";
import { checkAuth } from "../../../helpers/checkAuthDialog";
import ButtonSpinner from "../../common/spinner/buttonSpinner";
import { CurrentUser } from "../../../model/currentUser";
const styles = require("./commentInput.scss");

export interface PaperShowCommentInputProps {
  currentUser: CurrentUser;
  isPostingComment: boolean;
  isFailedToPostingComment: boolean;
  handlePostComment: (commentContent: string) => Promise<void>;
}

interface PaperShowCommentInputStates {
  commentInput: string;
}

class PaperShowCommentInput extends React.PureComponent<PaperShowCommentInputProps, PaperShowCommentInputStates> {
  public constructor(props: PaperShowCommentInputProps) {
    super(props);

    this.state = {
      commentInput: "",
    };
  }

  public render() {
    const { isPostingComment } = this.props;

    return (
      <div className={styles.inputBoxWrapper}>
        <AutoSizeTextarea
          wrapperClassName={styles.textAreaWrapper}
          textAreaClassName={styles.textArea}
          onFocus={this.handleFocusInput}
          onChange={this.handleChangeCommentInput}
          disabled={isPostingComment}
          value={this.state.commentInput}
          rows={3}
          placeholder="Leave your comments about this paper"
        />
        <div className={styles.postButtonWrapper}>{this.getPostButton()}</div>
      </div>
    );
  }

  private getPostButton() {
    if (this.props.isPostingComment) {
      return (
        <div className={`${styles.submitButton} ${styles.loadingSubmit}`}>
          <ButtonSpinner color={"#fff"} className={styles.buttonSpinner} />
          <span>POST</span>
        </div>
      );
    } else {
      return (
        <button
          onClick={this.handleClickPostButton}
          className={styles.submitButton}
          disabled={this.state.commentInput === ""}
        >
          <span>POST</span>
        </button>
      );
    }
  }

  private handleFocusInput = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (!this.props.currentUser || !this.props.currentUser.isLoggedIn) {
      checkAuth();
      e.currentTarget.blur();
    }
  };

  private handleChangeCommentInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      commentInput: e.currentTarget.value,
    });
  };

  private handleClickPostButton = async (_e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await this.props.handlePostComment(this.state.commentInput);
      this.setState({ commentInput: "" });
    } catch (_err) {
      return _err;
    }
  };
}

export default withStyles<typeof PaperShowCommentInput>(styles)(PaperShowCommentInput);
