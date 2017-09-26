import * as React from "react";
import { IArticleRecord } from "../../../model/article";
import CircularProgress from "material-ui/CircularProgress";
import LinearProgress from "material-ui/LinearProgress";
const styles = require("./summary.scss");

type EVALUATION_TYPES = "Originality" | "Contribution" | "Analysis" | "Expressiveness";

export interface IEvaluateSummaryProps {
  article: IArticleRecord;
}

interface IPointGraphNodeProps {
  field: EVALUATION_TYPES;
  point: number;
}

const PointGraphNode = ({ field, point }: IPointGraphNodeProps) => {
  let progressColor: string;
  switch (field) {
    case "Originality":
      progressColor = "#ff6e8f";
      break;

    case "Contribution":
      progressColor = "#ffcf48";
      break;

    case "Analysis":
      progressColor = "#6096ff";
      break;

    case "Expressiveness":
      progressColor = "#44c0c1";
      break;

    default:
      break;
  }

  return (
    <div className={styles.pointGraphItem}>
      <span className={styles.pointFieldText}>{field}</span>
      <span className={styles.linearProgressWrapper}>
        <LinearProgress color={progressColor} max={10} mode="determinate" value={point} />
      </span>
      <span className={styles.pointFieldPoint}>{point}</span>
    </div>
  );
};

const EvaluateSummary = (props: IEvaluateSummaryProps) => {
  const { article } = props;

  return (
    <div className={styles.summaryContainer}>
      <a target="_blank" href={article.link} className={styles.articleButton}>
        Go to read the article
      </a>
      <div className={styles.summaryWrapper}>
        <div className={styles.totalPointWrapper}>
          <CircularProgress
            color="#d5e1f7"
            mode="determinate"
            value={article.point.total}
            max={10}
            size={130}
            thickness={4}
          />
          <div className={styles.circularProgressWrapper}>
            <div className={styles.totalPoint}>{article.point.total}</div>
            <div className={styles.totalPointText}>Pointed</div>
          </div>
        </div>
        <div className={styles.pointGraphWrapper}>
          <PointGraphNode point={article.point.originality} field="Originality" />
          <PointGraphNode point={article.point.contribution} field="Contribution" />
          <PointGraphNode point={article.point.analysis} field="Analysis" />
          <PointGraphNode point={article.point.expressiveness} field="Expressiveness" />
        </div>
        <div className={styles.moreButton}>More Detail</div>
      </div>
    </div>
  );
};

export default EvaluateSummary;
