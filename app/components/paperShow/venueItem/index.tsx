import * as React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "../../../helpers/withStylesHelper";
import { trackEvent } from "../../../helpers/handleGA";
import { Paper } from "../../../model/paper";
import ActionTicketManager from "../../../helpers/actionTicketManager";
const styles = require("./venueItem.scss");

interface PaperShowVenueItemProps {
  paper: Paper;
}

const PaperShowVenueItem: React.SFC<PaperShowVenueItemProps> = props => {
  const { paper } = props;
  const { journal, conferenceInstance } = paper;

  if (!paper || !paper.year) {
    return null;
  }

  return (
    <div className={styles.published}>
      <div className={styles.paperContentBlockHeader}>Published</div>
      <ul className={styles.venueList}>
        {journal ? (
          <li className={styles.venueItem}>
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
              <div className={styles.venueTitle}>{`${journal.title || paper.venue}`}</div>
              <div className={styles.venueYear}>
                Year: <span className={styles.yearNumber}>{paper.year}</span>
              </div>
              <div className={styles.venueIF}>
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
          <li className={styles.venueItem}>
            {conferenceInstance &&
              conferenceInstance.conferenceSeries &&
              conferenceInstance.conferenceSeries.name && (
                <div className={styles.venueTitleReadonly}>{`${conferenceInstance.conferenceSeries.name}`}</div>
              )}
            <div className={styles.venueYear}>
              Year: <span className={styles.yearNumber}>{paper.year}</span>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default withStyles<typeof PaperShowVenueItem>(styles)(PaperShowVenueItem);
