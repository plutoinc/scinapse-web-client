import * as React from "react";
import * as moment from "moment";
import { Link } from "react-router-dom";
import { ICurrentUserRecord } from "../../../model/currentUser";
import { IEvaluationRecord } from "../../../model/evaluation";
import EvaluateUserInformation from "../../articleShow/components/evaluateUserInformation";
import Icon from "../../../icons/";
import EvaluationContent from "../../articleShow/components/evaluationContent";
import { IEvaluationCommentInputProps } from "../../articleShow/components/peerEvaluation/commentInput";
import EvaluationComments from "../../articleShow/components/peerEvaluation/comments";
import { IArticleRecord } from "../../../model/article";
const shave = require("shave").default;
const styles = require("./evaluationItem.scss");

interface IProfileEvaluationItemProps extends IEvaluationCommentInputProps {
  currentUser: ICurrentUserRecord;
  evaluation: IEvaluationRecord;
  article: IArticleRecord;
  handleVotePeerEvaluation: (articleId: number, evaluationId: number) => void;
}

interface IProfileEvaluationItemState {
  isOpen: boolean;
}

class ProfileEvaluationItem extends React.PureComponent<IProfileEvaluationItemProps, IProfileEvaluationItemState> {
  public constructor(props: IProfileEvaluationItemProps) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  private summaryElement: HTMLDivElement;

  private shaveTexts() {
    if (!!this.summaryElement) {
      shave(this.summaryElement, 40);
    }
  }

  private getStarIcon = () => {
    const { evaluation, handleVotePeerEvaluation } = this.props;

    if (evaluation.voted) {
      return <Icon className={styles.starIcon} icon="STAR" />;
    } else {
      return (
        <span
          onClick={() => {
            handleVotePeerEvaluation(evaluation.articleId, evaluation.id);
          }}
          style={{ cursor: "pointer" }}
          className={styles.starIcon}
        >
          <Icon icon="EMPTY_STAR" />
        </span>
      );
    }
  };

  private getOpenedBox = () => {
    const { currentUser, evaluation, handlePeerEvaluationCommentSubmit } = this.props;

    return (
      <div>
        <div className={styles.peerEvaluationContainer}>
          <div className={styles.openedHeader}>
            <EvaluateUserInformation className={styles.headerLeftBox} user={currentUser} />
            <div className={styles.headerRightBox}>
              <span className={styles.actionItemsWrapper}>
                {this.getStarIcon()}
                <span className={styles.rightItem}>{evaluation.vote}</span>
                <Icon className={styles.commentIcon} icon="COMMENT" />
                <span className={styles.rightItem}>{evaluation.comments.count()}</span>
              </span>
              <span onClick={this.toggleComponent} className={styles.toggleButtonWrapper}>
                <Icon className={styles.toggleButton} icon="CLOSE_ARTICLE_EVALUATION" />
              </span>
            </div>
          </div>
          <div className={styles.evaluationContentWrapper}>
            <EvaluationContent
              originalityScore={evaluation.point.originality}
              originalityComment={evaluation.point.originalityComment}
              significanceScore={evaluation.point.significance}
              significanceComment={evaluation.point.significanceComment}
              validityScore={evaluation.point.validity}
              validityComment={evaluation.point.validityComment}
              organizationScore={evaluation.point.organization}
              organizationComment={evaluation.point.organizationComment}
            />
          </div>
        </div>
        <EvaluationComments
          inputContainerStyle={{ border: 0, borderRadius: 0, borderTop: "1px solid #ecf1fa" }}
          handlePeerEvaluationCommentSubmit={handlePeerEvaluationCommentSubmit}
          currentUser={currentUser}
          evaluation={evaluation}
        />
      </div>
    );
  };

  private toggleComponent = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  private getClosedBox = () => {
    const { currentUser, evaluation } = this.props;

    return (
      <div className={styles.closedHeader}>
        <EvaluateUserInformation className={styles.headerLeftBox} user={currentUser} />
        <div className={styles.headerRightBox}>
          <span className={styles.scoreBox}>
            <span className={styles.scoreItem}>{evaluation.point.originality}</span>
            <span className={styles.scoreItem}>{evaluation.point.significance}</span>
            <span className={styles.scoreItem}>{evaluation.point.validity}</span>
            <span className={styles.scoreItem}>{evaluation.point.organization}</span>
            <span className={styles.scoreItem}>{evaluation.point.total}</span>
          </span>
          <span className={styles.actionItemsWrapper}>
            {this.getStarIcon()}
            <span className={styles.rightItem}>{evaluation.vote}</span>
            <Icon className={styles.commentIcon} icon="COMMENT" />
            <span className={styles.rightItem}>{evaluation.comments.count()}</span>
          </span>
          <span onClick={this.toggleComponent} className={styles.toggleButtonWrapper}>
            <Icon className={styles.toggleButton} icon="OPEN_ARTICLE_EVALUATION" />
          </span>
        </div>
      </div>
    );
  };

  public componentDidMount() {
    this.shaveTexts();
  }

  public render() {
    const { article, evaluation } = this.props;
    const { isOpen } = this.state;

    if (!article || !evaluation || article.isEmpty() || evaluation.isEmpty()) {
      return null;
    }

    return (
      <div className={styles.evaluationItem}>
        <div className={styles.articleInformationWrapper}>
          <Link to={`/articles/${article.id}`} className={styles.articleTitle}>
            {article.title}
          </Link>
          <div className={styles.articleInformation}>
            <span>{`posted by `}</span>
            <Link to={`/users/${article.createdBy.id}`}>{article.createdBy.name}</Link>
            <span>{`  |  posted at ${moment(article.createdAt).format("ll")}`}</span>
          </div>
          <Link style={{ display: "block" }} to={`/articles/${article.id}`}>
            <div ref={ele => (this.summaryElement = ele)} className={styles.articleSummary}>
              {article.summary}
            </div>
          </Link>
        </div>
        {isOpen ? this.getOpenedBox() : this.getClosedBox()}
      </div>
    );
  }
}

export default ProfileEvaluationItem;
