import * as React from "react";
const styles = require("./evaluationContent.scss");

interface IEvaluationContentProps {
  review: string;
}

const EvaluationContent = (props: IEvaluationContentProps) => {
  const { review } = props;

  return <div className={styles.content}>{review}</div>;
};

export default EvaluationContent;
