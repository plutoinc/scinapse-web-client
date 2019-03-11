import * as React from "react";
import { Link } from "react-router-dom";
import { createSelector } from "reselect";
import { connect } from "react-redux";
import { Paper } from "../../model/paper";
import { withStyles } from "../../helpers/withStylesHelper";
import { AppState } from "../../reducers";
import { getPaperEntities, getDenormalizedPapers } from "../../selectors/papersSelector";
import Icon from "../../icons";
const styles = require("./nextPaperTab.scss");

interface NextPaperTabProps {
  paperList: Paper[];
}

const NextPaperTab: React.FunctionComponent<NextPaperTabProps> = props => {
  const { paperList } = props;

  if (!paperList || paperList.length === 0) {
    return null;
  }

  const nextPaper = paperList[0];

  return (
    <Link className={styles.nextPaperTabWrapper} to={`/papers/${nextPaper.id}`}>
      <div className={styles.nextPaperTab}>
        <span className={styles.nextPaperTabTitle}>View next paper</span>
        <span className={styles.nextPaperTabContent}>{nextPaper.title}</span>
        <Icon className={styles.arrowRightIcon} icon="ARROW_RIGHT" />
      </div>
    </Link>
  );
};

function getPaperIds(state: AppState) {
  return state.paperShow.otherPaperIdsFromAuthor;
}

const getMemoizedRelatedPapers = createSelector([getPaperIds, getPaperEntities], getDenormalizedPapers);

function mapStateToProps(state: AppState) {
  return {
    paperList: getMemoizedRelatedPapers(state),
  };
}

export default connect(mapStateToProps)(withStyles<typeof NextPaperTab>(styles)(NextPaperTab));
