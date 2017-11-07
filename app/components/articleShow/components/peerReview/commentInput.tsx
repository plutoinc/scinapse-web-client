import * as React from "react";
import { ICurrentUserRecord } from "../../../../model/currentUser";
import { IReviewRecord } from "../../../../model/review";
import checkAuthDialog from "../../../../helpers/checkAuthDialog";
import AutoSizeTextarea from "../../../common/autoSizeTextarea";
import UserProfileIcon from "../../../common/userProfileIcon";
import { IPostCommentParams } from "../../../../api/article";
const styles = require("./commentInput.scss");

export interface IReviewCommentInputProps {
  currentUser: ICurrentUserRecord;
  review?: IReviewRecord;
  inputContainerStyle?: React.CSSProperties;
  handlePeerReviewCommentSubmit: (params: IPostCommentParams) => void;
}

// HACK
interface IReviewCommentInputStates {
  comment: string;
}

class ReviewCommentInput extends React.PureComponent<IReviewCommentInputProps, IReviewCommentInputStates> {
  private handleCommentChange = (comment: string) => {
    this.setState({
      comment,
    });
  };

  private handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { handlePeerReviewCommentSubmit, review } = this.props;

    handlePeerReviewCommentSubmit({
      articleId: review.articleId,
      comment: this.state.comment,
      reviewId: review.id,
    });

    this.setState({
      comment: "",
    });
  };

  public constructor(props: IReviewCommentInputProps) {
    super(props);

    this.state = {
      comment: "",
    };
  }

  public render() {
    const { review, currentUser } = this.props;
    const { comment } = this.state;

    if (!review) {
      return null;
    }

    return (
      <div style={this.props.inputContainerStyle} className={styles.reviewCommentInputWrapper}>
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

export default ReviewCommentInput;
