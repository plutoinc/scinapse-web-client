import * as React from "react";
import Authors, { AuthorsProps } from "./authors";
import { withStyles } from "../../../../helpers/withStylesHelper";
const styles = require("./publishInfoList.scss");

export interface PublishInfoListProps extends AuthorsProps {
  journalName: string;
  journalIF: number;
  year: number;
}

const PublishInfoList = (props: PublishInfoListProps) => {
  const { journalName, journalIF, year, authors, isAuthorsOpen, toggleAuthors } = props;

  return (
    <div className={styles.publishInfoList}>
      {journalName ? <a className={styles.journalName}>{journalName}</a> : null}
      {journalIF ? <span className={styles.bold}>{`[IF: ${journalIF.toFixed(2)}]`}</span> : null}
      {journalName ? <div className={styles.separatorLine} /> : null}
      {year ? <span className={styles.bold}>{year}</span> : null}
      {year ? <div className={styles.separatorLine} /> : null}
      <Authors authors={authors} isAuthorsOpen={isAuthorsOpen} toggleAuthors={toggleAuthors} />
    </div>
  );
};

export default withStyles<typeof PublishInfoList>(styles)(PublishInfoList);
