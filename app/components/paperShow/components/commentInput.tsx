import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import AutoSizeTextarea from "../../common/autoSizeTextarea";
import checkAuthDialog from "../../../helpers/checkAuthDialog";
import ButtonSpinner from "../../common/spinner/buttonSpinner";

const styles = require("./commentInput.scss");

export interface PaperShowCommentInputProps {
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
          onFocusFunc={checkAuthDialog}
          onChange={this.handleChangeCommentInput}
          disabled={isPostingComment}
          defaultValue={this.state.commentInput}
          rows={3}
          placeHolder="Leave your comments about this paper"
        />
        <div className={styles.postButtonWrapper}>{this.getPostButton()}</div>
      </div>
    );
  }

  private getPostButton() {
    if (this.props.isPostingComment) {
      return (
        <div className={styles.loadingSubmitButton}>
          <ButtonSpinner className={styles.buttonSpinner} />
          Post
        </div>
      );
    } else {
      return (
        <button
          onClick={this.handleClickPostButton}
          className={styles.submitButton}
          disabled={this.state.commentInput === ""}
        >
          POST
        </button>
      );
    }
  }

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
