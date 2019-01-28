import * as React from "react";
import { Link } from "react-router-dom";
import { Journal } from "../../../model/journal";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
import { trackEvent } from "../../../helpers/handleGA";
import ActionTicketManager from "../../../helpers/actionTicketManager";
const styles = require("./journalAndAuthors.scss");

interface PaperItemJournalProps {
  journal: Journal | null;
  year: number | null;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
  readOnly?: boolean;
  style?: React.CSSProperties;
}

const PaperItemJournal = ({ journal, year, style, readOnly, pageType, actionArea }: PaperItemJournalProps) => {
  if (journal && journal.title) {
    const title = readOnly ? (
      <span className={styles.journalName}>{journal.title}</span>
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
        className={styles.journalName}
      >
        {journal.title}
      </Link>
    );

    return (
      <div style={style} className={styles.journal}>
        <Icon icon="JOURNAL" />

        <div className={styles.journalText}>
          {year ? (
            <span className={styles.bold}>
              {year}
              {` in `}
            </span>
          ) : null}
          {title}
          {journal.impactFactor ? (
            <span className={styles.bold}>{` [IF: ${
              journal.impactFactor ? journal.impactFactor.toFixed(2) : 0
            }]`}</span>
          ) : null}
        </div>
      </div>
    );
  }

  return null;
};

export default withStyles<typeof PaperItemJournal>(styles)(PaperItemJournal);
