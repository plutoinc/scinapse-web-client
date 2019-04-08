import * as React from "react";
import { Link } from "react-router-dom";
import { createSelector } from "reselect";
import { connect } from "react-redux";
import { Paper } from "../../model/paper";
import { withStyles } from "../../helpers/withStylesHelper";
import { AppState } from "../../reducers";
import { getPaperEntities, getDenormalizedPapers } from "../../selectors/papersSelector";
import Icon from "../../icons";
const store = require("store");
const styles = require("./nextPaperTab.scss");

const RESEARCH_HISTORY_KEY = "r_h_list";

interface NextPaperTabProps {
  paperList: Paper[];
}

const NextPaperTab: React.FunctionComponent<NextPaperTabProps> = props => {
  const { paperList } = props;
  let nextPaper: Paper = paperList[0];

  if (!paperList || paperList.length === 0) {
    return null;
  }

  const prevVisitPapers: Paper[] = store.get(RESEARCH_HISTORY_KEY);
  if (prevVisitPapers && prevVisitPapers.length >= 2) {
    const prevVisitPaper: Paper = prevVisitPapers[1];
    if (paperList[0].id === prevVisitPaper.id) {
      nextPaper = paperList[Math.floor(Math.random() * (paperList.length - 1)) + 1];
    }
  }

  return !!nextPaper ? (
    <Link className={styles.nextPaperTabWrapper} to={`/papers/${nextPaper.id}`}>
      <div className={styles.nextPaperTab}>
        <span className={styles.nextPaperTabTitle}>View next paper</span>
        <span className={styles.nextPaperTabContent}>{nextPaper.title}</span>
        <Icon className={styles.arrowRightIcon} icon="ARROW_RIGHT" />
      </div>
    </Link>
  ) : null;
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
