import * as React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "../../../helpers/withStylesHelper";
import { trackEvent } from "../../../helpers/handleGA";
import { Paper } from "../../../model/paper";
const styles = require("./journalItem.scss");

interface PaperShowJournalItemProps {
  paper: Paper;
}

const PaperShowJournalItem: React.SFC<PaperShowJournalItemProps> = props => {
  const { paper } = props;
  const { journal } = paper;

  if (!paper || !paper.year) {
    return null;
  }

  return (
    <div className={styles.published}>
      <div className={styles.paperContentBlockHeader}>Published</div>
      <ul className={styles.journalList}>
        {journal ? (
          <li className={styles.journalItem}>
            <Link
              to={`/journals/${journal.id}`}
              onClick={() => {
                trackEvent({ category: "Search", action: "Click Journal", label: "" });
              }}
            >
              <div className={styles.journalTitle}>{`${journal.fullTitle || paper.venue}`}</div>
              <div className={styles.journalYear}>{paper.year}</div>
              <div className={styles.journalIF}>
                {journal.impactFactor ? ` Impact Factor: ${journal.impactFactor.toFixed(2)}` : ""}
              </div>
            </Link>
          </li>
        ) : (
          <li className={styles.journalItem}>
            <div className={styles.journalYear}>{paper.year}</div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default withStyles<typeof PaperShowJournalItem>(styles)(PaperShowJournalItem);
