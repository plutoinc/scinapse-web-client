import * as React from "react";
import { Link } from "react-router-dom";
import { Paper } from "../../model/paper";
import { connect } from "react-redux";
import { withStyles } from "../../helpers/withStylesHelper";
import { AppState } from "../../reducers";
import { createSelector } from "reselect";
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
    <div className={styles.nextPaperTabWrapper}>
      <div className={styles.nextPaperTab}>
        <span className={styles.nextPaperTabTitle}>View next paper</span>
        <Link className={styles.nextPaperTabContent} to={`/papers/${nextPaper.id}`}>
          {nextPaper.title}
        </Link>
        <Icon className={styles.arrowRightIcon} icon="ARROW_RIGHT" />
      </div>
    </div>
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
