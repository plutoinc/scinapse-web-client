import * as React from "react";
import { Link } from "react-router-dom";
import { Paper } from "../../model/paper";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import ActionTicketManager from "../../helpers/actionTicketManager";
const store = require("store");
const styles = require("./nextPaperTab.scss");

const RESEARCH_HISTORY_KEY = "r_h_list";

interface NextPaperTabProps {
  paperList: Paper[];
}

const NextPaperTab: React.FunctionComponent<NextPaperTabProps> = ({ paperList }) => {
  if (paperList.length === 0) return null;

  let nextPaper = paperList[0];
  const prevVisitPapers: Paper[] = store.get(RESEARCH_HISTORY_KEY);
  if (prevVisitPapers && prevVisitPapers.length >= 2) {
    const prevVisitPaper = prevVisitPapers[1];
    if (paperList[0].id === prevVisitPaper.id) {
      nextPaper = paperList[Math.floor(Math.random() * (paperList.length - 1)) + 1];
    }
  }
  return (
    <Link
      className={styles.nextPaperTabWrapper}
      onClick={() => {
        ActionTicketManager.trackTicket({
          pageType: "paperShow",
          actionType: "fire",
          actionArea: "nextPaper",
          actionTag: "paperShow",
          actionLabel: nextPaper.id.toString(),
        });
      }}
      to={`/papers/${nextPaper.id}`}
    >
      <div className={styles.nextPaperTab}>
        <span className={styles.nextPaperTabTitle}>View next paper</span>
        <span className={styles.nextPaperTabContent}>{nextPaper.title}</span>
        <Icon className={styles.arrowRightIcon} icon="ARROW_RIGHT" />
      </div>
    </Link>
  );
};

export default withStyles<typeof NextPaperTab>(styles)(NextPaperTab);
