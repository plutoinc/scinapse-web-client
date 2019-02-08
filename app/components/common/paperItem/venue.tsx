import * as React from "react";
import { Link } from "react-router-dom";
import { Journal } from "../../../model/journal";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
import { trackEvent } from "../../../helpers/handleGA";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import { ConferenceInstance } from "../../../model/conferenceInstance";
const styles = require("./venueAndAuthors.scss");

interface PaperItemVenueProps {
  journal: Journal | null;
  conferenceInstance: ConferenceInstance | null;
  year: number | null;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
  readOnly?: boolean;
  style?: React.CSSProperties;
}

const PaperItemVenue = ({
  journal,
  conferenceInstance,
  year,
  style,
  readOnly,
  pageType,
  actionArea,
}: PaperItemVenueProps) => {
  let title = null;
  let impactFactor = null;
  if (journal && journal.title) {
    title = readOnly ? (
      <span className={styles.venueNameReadonly}>{journal.title}</span>
    ) : (
      <Link
        to={`/journals/${journal.id}`}
        onClick={() => {
          trackEvent({ category: "Search", action: "Click Journal", label: "" });
          ActionTicketManager.trackTicket({
            pageType,
            actionType: "fire",
            actionArea: actionArea || pageType,
            actionTag: "journalShow",
            actionLabel: String(journal.id),
          });
        }}
        className={styles.venueName}
      >
        {journal.title}
      </Link>
    );
    impactFactor = journal.impactFactor;
  } else if (conferenceInstance && conferenceInstance.conferenceSeries && conferenceInstance.conferenceSeries.name) {
    title = <span className={styles.venueNameReadonly}>{conferenceInstance.conferenceSeries.name}</span>;
  } else {
    return null;
  }

  return (
    <div style={style} className={styles.venue}>
      <Icon icon="JOURNAL" />

      <div className={styles.journalText}>
        {year ? (
          <span className={styles.bold}>
            {year}
            {` in `}
          </span>
        ) : null}
        {title}
        {impactFactor ? (
          <span className={styles.bold}>{` [IF: ${impactFactor ? impactFactor.toFixed(2) : 0}]`}</span>
        ) : null}
      </div>
    </div>
  );
};

export default withStyles<typeof PaperItemVenue>(styles)(PaperItemVenue);
