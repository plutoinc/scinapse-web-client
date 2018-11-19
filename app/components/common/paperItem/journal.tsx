import * as React from "react";
import { Link } from "react-router-dom";
import { Journal } from "../../../model/journal";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
import { trackEvent } from "../../../helpers/handleGA";
const styles = require("./publishInfoList.scss");

interface PaperItemJournalProps {
  journal: Journal | null;
  year: number | null;
  readOnly?: boolean;
  style?: React.CSSProperties;
}

const PaperItemJournal = ({ journal, year, style, readOnly }: PaperItemJournalProps) => {
  if (journal && journal.fullTitle) {
    const title = readOnly ? (
      <span className={styles.journalName}>{journal.fullTitle}</span>
    ) : (
      <Link
        to={`/journals/${journal.id}`}
        onClick={() => {
          trackEvent({ category: "Search", action: "Click Journal", label: "" });
        }}
        className={styles.journalName}
      >
        {journal.fullTitle}
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
