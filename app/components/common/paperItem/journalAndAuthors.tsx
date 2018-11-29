import * as React from "react";
import Authors, { AuthorsProps } from "./authors";
import PaperItemJournal from "./journal";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
import { Journal } from "../../../model/journal";
const styles = require("./journalAndAuthors.scss");

export interface JournalAndAuthorsProps extends Readonly<AuthorsProps> {
  journal: Journal | null;
  year: number | null;
}

class JournalAndAuthors extends React.PureComponent<JournalAndAuthorsProps, {}> {
  public render() {
    const { authors, journal, year, paper } = this.props;

    return (
      <div className={styles.publishInfoList}>
        <PaperItemJournal journal={journal} year={year} />
        {authors ? (
          <div className={styles.author}>
            <Icon icon="AUTHOR" />
            <Authors paper={paper} authors={authors} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default withStyles<typeof JournalAndAuthors>(styles)(JournalAndAuthors);
