import * as React from "react";
import { IArticleRecord } from "../../../model/article";
import CircularProgress from "material-ui/CircularProgress";
import LinearProgress from "material-ui/LinearProgress";
import { EVALUATION_TYPES } from "../../../model/evaluation";
import Icon from "../../../icons";
const styles = require("./summary.scss");

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

    case "Significance":
      progressColor = "#ffcf48";
      break;

    case "Validity":
      progressColor = "#6096ff";
      break;

    case "Organization":
      progressColor = "#44c0c1";
      break;

    default:
      break;
  }

  return (
    <div className={styles.pointGraphItem}>
      <span className={styles.pointFieldText}>{field}</span>
      <span className={styles.linearProgressWrapper}>
        <LinearProgress
          color={progressColor}
          max={10}
          style={{ backgroundColor: "#F1F3F6" }}
          mode="determinate"
          value={point}
        />
      </span>
      <span className={styles.pointFieldPoint}>{point.toFixed(2)}</span>
    </div>
  );
};

const EvaluateSummary = (props: IEvaluateSummaryProps) => {
  const { article } = props;

  let totalPoint: number = 0;
  let originalityPoint: number = 0;
  let significancePoint: number = 0;
  let validityPoint: number = 0;
  let organizationPoint: number = 0;

  if (article.point) {
    totalPoint = article.point.total;
    originalityPoint = article.point.originality;
    significancePoint = article.point.significance;
    validityPoint = article.point.validity;
    organizationPoint = article.point.organization;
  }

  return (
    <div className={styles.summaryContainer}>
      <a target="_blank" href={article.link} className={styles.articleButton}>
        <Icon className={styles.articleButtonIcon} icon="EXTERNAL_SHARE" />
        <span>Go to read the article</span>
      </a>
      <div className={styles.summaryWrapper}>
        <div className={styles.totalPointWrapper}>
          <CircularProgress color="#d5e1f7" mode="determinate" value={totalPoint} max={10} size={130} thickness={4} />
          <div className={styles.circularProgressWrapper}>
            <div className={styles.totalPoint}>{totalPoint.toFixed(2)}</div>
            <div className={styles.totalPointText}>Pointed</div>
          </div>
        </div>
        <div className={styles.pointGraphWrapper}>
          <PointGraphNode point={originalityPoint} field="Originality" />
          <PointGraphNode point={significancePoint} field="Significance" />
          <PointGraphNode point={validityPoint} field="Validity" />
          <PointGraphNode point={organizationPoint} field="Organization" />
        </div>
        <div className={styles.moreButton}>More Detail</div>
      </div>
    </div>
  );
};

export default EvaluateSummary;
