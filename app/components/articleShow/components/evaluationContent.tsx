import * as React from "react";
const styles = require("./evaluationContent.scss");

interface IEvaluationContentProps {
  originalityScore: number;
  originalityComment: string;
  significanceScore: number;
  significanceComment: string;
  validityScore: number;
  validityComment: string;
  organizationScore: number;
  organizationComment: string;
}

export const mockContent =
  "Please specify as the mechanism of loss of function of the mutation in patients with mutations at position p.335-339 is reduced protein stability due to rapid protein degradation at the proteasome, rather than reduced catalysis.";

const EvaluationContent = (props: IEvaluationContentProps) => {
  const {
    originalityScore,
    originalityComment,
    significanceScore,
    significanceComment,
    validityScore,
    validityComment,
    organizationScore,
    organizationComment,
  } = props;

  return (
    <div className={styles.content}>
      <div className={styles.evaluationResultListItem}>
        <span className={styles.scoreSection}>
          <div className={styles.score}>{originalityScore}</div>
          <div className={styles.scoreTitle}>Originality</div>
        </span>
        <span className={styles.scoreComment}>{originalityComment}</span>
      </div>
      <div className={styles.evaluationResultListItem}>
        <span className={styles.scoreSection}>
          <div className={styles.score}>{significanceScore}</div>
          <div className={styles.scoreTitle}>Significance</div>
        </span>
        <span className={styles.scoreComment}>{significanceComment}</span>
      </div>
      <div className={styles.evaluationResultListItem}>
        <span className={styles.scoreSection}>
          <div className={styles.score}>{validityScore}</div>
          <div className={styles.scoreTitle}>Validity</div>
        </span>
        <span className={styles.scoreComment}>{validityComment}</span>
      </div>
      <div className={styles.evaluationResultListItem}>
        <span className={styles.scoreSection}>
          <div className={styles.score}>{organizationScore}</div>
          <div className={styles.scoreTitle}>Organization</div>
        </span>
        <span className={styles.scoreComment}>{organizationComment}</span>
      </div>
    </div>
  );
};

export default EvaluationContent;
