import * as React from "react";
import { ICurrentUserRecord } from "../../../../model/currentUser";
// import RoundImage from "../../../common/roundImage";
import { IArticleShowStateRecord } from "../../records";
import EvaluateUserInformation from "../evaluateUserInformation";
import Icon from "../../../../icons";
import EvaluationContent from "../evaluationContent";
const styles = require("./finalStep.scss");

export interface IEvaluationFinalStepProps {
  currentUser: ICurrentUserRecord;
  articleShow: IArticleShowStateRecord;
}

export const mockContent =
  "Please specify as the mechanism of loss of function of the mutation in patients with mutations at position p.335-339 is reduced protein stability due to rapid protein degradation at the proteasome, rather than reduced catalysis.";

function getHeader(props: IEvaluationFinalStepProps) {
  const { currentUser } = props;

  return (
    <div className={styles.header}>
      <EvaluateUserInformation className={styles.headerLeftBox} currentUser={currentUser} />
      <div className={styles.headerRightBox}>
        {/* TODO: Add star icon and Link data */}
        <Icon className={styles.starIcon} icon="STAR" />
        <span className={styles.rightItem}>9</span>
        <Icon className={styles.commentIcon} icon="COMMENT" />
        <span className={styles.rightItem}>3</span>
      </div>
    </div>
  );
}

function getFooter() {
  return (
    <div className={styles.footer}>
      {/* TODO: Add & Link FromNow data */}
      <div className={styles.createdAt}>Evaluated at 1days ago</div>
    </div>
  );
}

const EvaluationFinalStep = (props: IEvaluationFinalStepProps) => {
  return (
    <div className={styles.contentWrapper}>
      {getHeader(props)}
      {/* Change below data as user's input data */}
      <EvaluationContent
        originalityScore={5}
        contributionScore={5}
        analysisScore={5}
        expressivenessScore={5}
        originalityComment={mockContent}
        contributionComment={mockContent}
        analysisComment={mockContent}
        expressivenessComment={mockContent}
      />
      {getFooter()}
    </div>
  );
};

export default EvaluationFinalStep;
