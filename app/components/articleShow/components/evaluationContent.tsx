import * as React from "react";
const styles = require("./evaluationContent.scss");

interface IEvaluationContentProps {
  originalityScore: number;
  contributionScore: number;
  analysisScore: number;
  expressivenessScore: number;
  originalityComment: string;
  contributionComment: string;
  analysisComment: string;
  expressivenessComment: string;
}

export const mockContent =
  "Please specify as the mechanism of loss of function of the mutation in patients with mutations at position p.335-339 is reduced protein stability due to rapid protein degradation at the proteasome, rather than reduced catalysis.";

const EvaluationContent = (props: IEvaluationContentProps) => {
  const {
    originalityScore,
    contributionScore,
    analysisScore,
    expressivenessScore,
    originalityComment,
    contributionComment,
    analysisComment,
    expressivenessComment,
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
          <div className={styles.score}>{contributionScore}</div>
          <div className={styles.scoreTitle}>Contribution</div>
        </span>
        <span className={styles.scoreComment}>{contributionComment}</span>
      </div>
      <div className={styles.evaluationResultListItem}>
        <span className={styles.scoreSection}>
          <div className={styles.score}>{analysisScore}</div>
          <div className={styles.scoreTitle}>Analysis</div>
        </span>
        <span className={styles.scoreComment}>{analysisComment}</span>
      </div>
      <div className={styles.evaluationResultListItem}>
        <span className={styles.scoreSection}>
          <div className={styles.score}>{expressivenessScore}</div>
          <div className={styles.scoreTitle}>Expressiveness</div>
        </span>
        <span className={styles.scoreComment}>{expressivenessComment}</span>
      </div>
    </div>
  );
};

export default EvaluationContent;
