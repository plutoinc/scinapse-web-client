import * as React from "react";
import * as moment from "moment";
import { ICurrentUserRecord } from "../../../../model/currentUser";
// import RoundImage from "../../../common/roundImage";
import { IArticleShowStateRecord } from "../../records";
import EvaluateUserInformation from "../evaluateUserInformation";
import Icon from "../../../../icons";
import EvaluationContent from "../evaluationContent";
import { IEvaluationRecord } from "../../../../model/evaluation";
const styles = require("./finalStep.scss");

export interface IEvaluationFinalStepProps {
  currentUser: ICurrentUserRecord;
  articleShow: IArticleShowStateRecord;
  evaluation: IEvaluationRecord;
}

function getStarIcon(voted: boolean) {
  if (voted) {
    return <Icon className={styles.starIcon} icon="STAR" />;
  } else {
    return <Icon className={styles.starIcon} icon="EMPTY_STAR" />;
  }
}

function getHeader(props: IEvaluationFinalStepProps) {
  const { currentUser, evaluation } = props;

  return (
    <div className={styles.header}>
      <EvaluateUserInformation className={styles.headerLeftBox} currentUser={currentUser} />
      <div className={styles.headerRightBox}>
        {getStarIcon(evaluation.voted)}
        <span className={styles.rightItem}>{evaluation.vote}</span>
        <Icon className={styles.commentIcon} icon="COMMENT" />
        <span className={styles.rightItem}>{evaluation.comments.count()}</span>
      </div>
    </div>
  );
}

function getFooter(props: IEvaluationFinalStepProps) {
  return (
    <div className={styles.footer}>
      <div className={styles.createdAt}>Evaluated at {moment(props.evaluation.createdAt).fromNow()}</div>
    </div>
  );
}

const EvaluationFinalStep = (props: IEvaluationFinalStepProps) => {
  const { evaluation } = props;

  const placeholderComment = "There is no comment.";

  return (
    <div className={styles.contentWrapper}>
      {getHeader(props)}
      <EvaluationContent
        originalityScore={evaluation.point.originality}
        contributionScore={evaluation.point.contribution}
        analysisScore={evaluation.point.analysis}
        expressivenessScore={evaluation.point.expressiveness}
        originalityComment={evaluation.point.originalityComment || placeholderComment}
        contributionComment={evaluation.point.contributionComment || placeholderComment}
        analysisComment={evaluation.point.analysisComment || placeholderComment}
        expressivenessComment={evaluation.point.expressivenessComment || placeholderComment}
      />
      {getFooter(props)}
    </div>
  );
};

export default EvaluationFinalStep;
