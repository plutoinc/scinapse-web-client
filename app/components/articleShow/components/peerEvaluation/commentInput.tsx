import * as React from "react";
import Icon from "../../../../icons";
import { ICurrentUserRecord } from "../../../../model/currentUser";
import { IHandlePeerEvaluationCommentSubmitParams } from "../../actions";
import { IEvaluationRecord } from "../../../../model/evaluation";
const styles = require("./commentInput.scss");

export interface IEvaluationCommentInputProps {
  currentUser: ICurrentUserRecord;
  evaluation: IEvaluationRecord;
  handlePeerEvaluationCommentSubmit: (params: IHandlePeerEvaluationCommentSubmitParams) => void;
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
      comment: this.state.comment,
      evaluationId: Number(evaluation.createdAt), // TODO: HACK, we need evaulation Id
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
    const { comment } = this.state;

    return (
      <div className={styles.evaluationCommentInputWrapper}>
        <span className={styles.userAvatarWrapper}>
          {/* <RoundImage width={34} height={34} /> */}
          <Icon className={styles.avatarIcon} icon="AVATAR" />
        </span>
        <form className={styles.form} onSubmit={this.handleCommentSubmit}>
          {/* TODO: Add auth check when focused */}
          <input
            className={styles.commentInput}
            onChange={e => {
              this.handleCommentChange(e.currentTarget.value);
            }}
            value={comment}
            placeholder="Comment your opinion about this peer evaluation"
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
