import * as React from "react";
import * as moment from "moment";
import { ICurrentUserRecord } from "../../../../model/currentUser";
// import RoundImage from "../../../common/roundImage";
import { IArticleShowStateRecord } from "../../records";
import EvaluateUserInformation from "../evaluateUserInformation";
import Icon from "../../../../icons";
import EvaluationContent from "../evaluationContent";
import { IReviewRecord } from "../../../../model/review";
const styles = require("./finalStep.scss");

export interface IEvaluationFinalStepProps {
  currentUser: ICurrentUserRecord;
  articleShow: IArticleShowStateRecord;
  evaluation: IReviewRecord;
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
      <EvaluateUserInformation className={styles.headerLeftBox} user={currentUser} />
      <div className={styles.headerRightBox}>
        {getStarIcon(evaluation.voted)}
        <span className={styles.rightItem}>{evaluation.vote}</span>
        <Icon className={styles.commentIcon} icon="COMMENT" />
        <span className={styles.rightItem}>{evaluation.commentSize}</span>
      </div>
    </div>
  );
}

function getFooter(props: IEvaluationFinalStepProps) {
  return (
    <div className={styles.footer}>
      <div className={styles.createdAt}>Reviewed at {moment(props.evaluation.createdAt).fromNow()}</div>
    </div>
  );
}

const EvaluationFinalStep = (props: IEvaluationFinalStepProps) => {
  const { evaluation } = props;

  if (!evaluation) {
    return null;
  }

  return (
    <div className={styles.contentWrapper}>
      {getHeader(props)}
      <EvaluationContent review={evaluation.point.review} />
      {getFooter(props)}
    </div>
  );
};

export default EvaluationFinalStep;
