import * as React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "../../../helpers/withStylesHelper";
import { trackEvent } from "../../../helpers/handleGA";
import { Paper } from "../../../model/paper";
import ActionTicketManager from "../../../helpers/actionTicketManager";
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
                trackEvent({
                  category: "New Paper Show",
                  action: "Click Journal in PaperInfo Section",
                  label: `Click Journal ID : ${journal.id}`,
                });

                ActionTicketManager.trackTicket({
                  pageType: "paperShow",
                  actionType: "fire",
                  actionArea: "paperDescription",
                  actionTag: "journalShow",
                  actionLabel: String(journal.id),
                });
              }}
            >
              <div className={styles.journalTitle}>{`${journal.fullTitle || paper.venue}`}</div>
              <div className={styles.journalYear}>
                Year: <span className={styles.yearNumber}>{paper.year}</span>
              </div>
              <div className={styles.journalIF}>
                {journal.impactFactor && (
                  <span>
                    {`Impact Factor: `}
                    <span className={styles.ifNumber}>{journal.impactFactor.toFixed(2)}</span>
                  </span>
                )}
              </div>
            </Link>
          </li>
        ) : (
          <li className={styles.journalItem}>
            <div className={styles.journalYear}>
              Year: <span className={styles.yearNumber}>{paper.year}</span>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default withStyles<typeof PaperShowJournalItem>(styles)(PaperShowJournalItem);
