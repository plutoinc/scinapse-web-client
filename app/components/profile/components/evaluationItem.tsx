import * as React from "react";
import * as moment from "moment";
import { Link } from "react-router-dom";
import { ICurrentUserRecord } from "../../../model/currentUser";
import { IReviewRecord } from "../../../model/review";
import EvaluateUserInformation from "../../articleShow/components/evaluateUserInformation";
import Icon from "../../../icons/";
import { IArticleRecord } from "../../../model/article";
const shave = require("shave").default;
const styles = require("./evaluationItem.scss");

interface IProfileEvaluationItemProps {
  currentUser: ICurrentUserRecord;
  evaluation: IReviewRecord;
  article: IArticleRecord;
  handleVotePeerEvaluation: (articleId: number, evaluationId: number) => void;
}

class ProfileEvaluationItem extends React.PureComponent<IProfileEvaluationItemProps, {}> {
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

  private getEvaluationBox = () => {
    const { evaluation } = this.props;

    return (
      <div className={styles.closedHeader}>
        <EvaluateUserInformation className={styles.headerLeftBox} user={evaluation.createdBy} />
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
            <span className={styles.rightItem}>{evaluation.commentSize}</span>
          </span>
          <Link to={`/articles/${evaluation.articleId}`} className={styles.toggleButtonWrapper}>
            <Icon className={styles.toggleButton} icon="OPEN_ARTICLE_EVALUATION" />
          </Link>
        </div>
      </div>
    );
  };

  public componentDidMount() {
    this.shaveTexts();
  }

  public render() {
    const { article, evaluation } = this.props;

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
        {this.getEvaluationBox()}
      </div>
    );
  }
}

export default ProfileEvaluationItem;
