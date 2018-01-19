import * as React from "react";
import { IAuthorsProps } from "./authors";

import Authors from "./authors";

const styles = require("./publishInfoList.scss");

export interface IPublishInfoListProps extends IAuthorsProps {
  journalName: string;
  journalIF: number;
  year: number;
}

const PublishInfoList = (props: IPublishInfoListProps) => {
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

export default PublishInfoList;
