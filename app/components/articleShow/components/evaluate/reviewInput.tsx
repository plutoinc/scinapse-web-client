import * as React from "react";
import { ICurrentUserRecord } from "../../../../model/currentUser";
// import RoundImage from "../../../common/roundImage";
import { IArticleShowStateRecord } from "../../records";
import EvaluateUserInformation from "../evaluateUserInformation";
import AutoSizeTextarea from "../../../common/autoSizeTextarea";
import Tooltip from "../../../common/tooltip/tooltip";
import formatNumber from "../../../../helpers/formatNumber";

const styles = require("./reviewInput.scss");

export interface IReviewInputProps {
  currentUser: ICurrentUserRecord;
  articleShow: IArticleShowStateRecord;
  handleReviewChange: (review: string) => void;
}

function getHeader(props: IReviewInputProps) {
  const { currentUser, articleShow } = props;
  const { myOrganizationScore, mySignificanceScore, myValidityScore, myOriginalityScore } = articleShow;
  const totalScore = formatNumber(
    (myOrganizationScore + mySignificanceScore + myValidityScore + myOriginalityScore) / 4,
    2,
  );

  return (
    <div className={styles.header}>
      <EvaluateUserInformation className={styles.headerLeftBox} user={currentUser} />
      <div className={styles.headerRightBox}>
        <span className={styles.scoreBox}>
          <span className={styles.scoreItem}>
            <Tooltip className={styles.scoreItemTooltip} left={-20} top={-26} iconTop={-6} content={"Originality"} />
            {myOrganizationScore}
          </span>
          <span className={styles.scoreItem}>
            <Tooltip className={styles.scoreItemTooltip} left={-26} top={-26} iconTop={-6} content={"Significance"} />
            {mySignificanceScore}
          </span>
          <span className={styles.scoreItem}>
            <Tooltip className={styles.scoreItemTooltip} left={-14} top={-26} iconTop={-6} content={"Validity"} />
            {myValidityScore}
          </span>
          <span className={styles.scoreItem}>
            <Tooltip className={styles.scoreItemTooltip} left={-25} top={-26} iconTop={-6} content={"Organization"} />
            {myOriginalityScore}
          </span>
          <span className={styles.totalPoint}>{totalScore}</span>
        </span>
      </div>
    </div>
  );
}

const ReviewInput = (props: IReviewInputProps) => {
  const { articleShow, handleReviewChange } = props;
  const TextArea = (
    <AutoSizeTextarea
      onChange={e => {
        e.preventDefault();
        handleReviewChange(e.currentTarget.value);
      }}
      value={articleShow.reviewInput}
      placeholder="Additional Comments for the Author"
      className={styles.commentWrapper}
    />
  );

  return (
    <div className={styles.reviewInputContainer}>
      {getHeader(props)}
      <div className={styles.inputWrapper}>{TextArea}</div>
    </div>
  );
};

export default ReviewInput;
