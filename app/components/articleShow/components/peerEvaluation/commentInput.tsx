import * as React from "react";
import { ICurrentUserRecord } from "../../../../model/currentUser";
import { IReviewRecord } from "../../../../model/review";
import checkAuthDialog from "../../../../helpers/checkAuthDialog";
import AutoSizeTextarea from "../../../common/autoSizeTextarea";
import UserProfileIcon from "../../../common/userProfileIcon";
import { IPostCommentParams } from "../../../../api/article";
const styles = require("./commentInput.scss");

export interface IEvaluationCommentInputProps {
  currentUser: ICurrentUserRecord;
  evaluation?: IReviewRecord;
  inputContainerStyle?: React.CSSProperties;
  handlePeerEvaluationCommentSubmit: (params: IPostCommentParams) => void;
}

// HACK
interface IEvaluationCommentInputStates {
  comment: string;
}

class EvaluationCommentInput extends React.PureComponent<IEvaluationCommentInputProps, IEvaluationCommentInputStates> {
  private handleCommentChange = (comment: string) => {
    this.setState({
      comment,
    });
  };

  private handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { handlePeerEvaluationCommentSubmit, evaluation } = this.props;

    handlePeerEvaluationCommentSubmit({
      articleId: evaluation.articleId,
      comment: this.state.comment,
      reviewId: evaluation.id,
    });

    this.setState({
      comment: "",
    });
  };

  public constructor(props: IEvaluationCommentInputProps) {
    super(props);

    this.state = {
      comment: "",
    };
  }

  public render() {
    const { evaluation, currentUser } = this.props;
    const { comment } = this.state;

    if (!evaluation) {
      return null;
    }

    return (
      <div style={this.props.inputContainerStyle} className={styles.evaluationCommentInputWrapper}>
        <span className={styles.userAvatarWrapper}>
          <UserProfileIcon profileImage={currentUser.profileImage} userId={currentUser.id} type="small" />
        </span>
        <form className={styles.form} onFocus={checkAuthDialog} onSubmit={this.handleCommentSubmit}>
          <AutoSizeTextarea
            className={styles.commentInput}
            onChange={e => {
              e.preventDefault();
              this.handleCommentChange(e.currentTarget.value);
            }}
            value={comment}
            placeholder="Comment your opinion about this peer review"
          />
          <div className={styles.submitButtonWrapper}>
            <button disabled={!comment || comment.length === 0} className={styles.submitButton} type="submit">
              Confirm
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default EvaluationCommentInput;
