import * as React from "react";
import { ICurrentUserStateRecord } from "../../../../model/currentUser";
// import RoundImage from "../../../common/roundImage";
import { IArticleShowStateRecord } from "../../records";
import Icon from "../../../../icons";
const styles = require("./finalStep.scss");

export interface IEvaluationFinalStepProps {
  currentUser: ICurrentUserStateRecord;
  articleShow: IArticleShowStateRecord;
}

const mockContent =
  "Please specify as the mechanism of loss of function of the mutation in patients with mutations at position p.335-339 is reduced protein stability due to rapid protein degradation at the proteasome, rather than reduced catalysis.";

function getHeader(props: IEvaluationFinalStepProps) {
  const { currentUser } = props;

  return (
    <div className={styles.header}>
      <div className={styles.headerLeftBox}>
        <span className={styles.userImageWrapper}>
          {/* TODO: Connect user Profile image */}
          {/* <RoundImage width={37} height={37} /> */}
          <Icon className={styles.avatarIcon} icon="AVATAR" />
        </span>
        <span className={styles.userInformation}>
          <div className={styles.username}>{currentUser.nickName || "Mock CurrentName"}</div>
          <div className={styles.organization}>
            {/* TODO: Connect organization data */}
            University of Michigan
          </div>
        </span>
      </div>
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

function getContent(props: IEvaluationFinalStepProps) {
  const { articleShow } = props;

  return (
    <div className={styles.content}>
      <div className={styles.evaluationResultListItem}>
        <span className={styles.scoreSection}>
          <div className={styles.score}>{articleShow.myOriginalityScore || 5}</div>
          <div className={styles.scoreTitle}>Originality</div>
        </span>
        <span className={styles.scoreComment}>{articleShow.myOriginalityComment || mockContent}</span>
      </div>
      <div className={styles.evaluationResultListItem}>
        <span className={styles.scoreSection}>
          <div className={styles.score}>{articleShow.myContributionScore || 5}</div>
          <div className={styles.scoreTitle}>Contribution</div>
        </span>
        <span className={styles.scoreComment}>{articleShow.myContributionComment || mockContent}</span>
      </div>
      <div className={styles.evaluationResultListItem}>
        <span className={styles.scoreSection}>
          <div className={styles.score}>{articleShow.myAnalysisScore || 5}</div>
          <div className={styles.scoreTitle}>Analysis</div>
        </span>
        <span className={styles.scoreComment}>{articleShow.myAnalysisComment || mockContent}</span>
      </div>
      <div className={styles.evaluationResultListItem}>
        <span className={styles.scoreSection}>
          <div className={styles.score}>{articleShow.myExpressivenessScore || 5}</div>
          <div className={styles.scoreTitle}>Expressiveness</div>
        </span>
        <span className={styles.scoreComment}>{articleShow.myExpressivenessComment || mockContent}</span>
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
      {getContent(props)}
      {getFooter()}
    </div>
  );
};

export default EvaluationFinalStep;
