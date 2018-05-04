import * as React from "react";
import Authors, { AuthorsProps } from "./authors";
import { withStyles } from "../../../../helpers/withStylesHelper";
const styles = require("./publishInfoList.scss");
import papersQueryFormatter from "../../../../helpers/papersQueryFormatter";

export interface PublishInfoListProps extends AuthorsProps {
  journalName: string;
  journalIF: number;
  year: number;
}

class PublishInfoList extends React.Component<PublishInfoListProps, {}> {
  public shouldComponentUpdate(nextProps: PublishInfoListProps) {
    if (
      this.props.journalName !== nextProps.journalName ||
      this.props.journalIF !== nextProps.journalIF ||
      this.props.year !== nextProps.year ||
      this.props.authors !== nextProps.authors ||
      this.props.isAuthorsOpen !== nextProps.isAuthorsOpen
    ) {
      return true;
    } else {
      return false;
    }
  }

  public render() {
    const { journalName, journalIF, year, authors, isAuthorsOpen, toggleAuthors } = this.props;

    return (
      <div className={styles.publishInfoList}>
        {journalName ? (
          <a
            href={`/search?${papersQueryFormatter.stringifyPapersQuery({
              query: journalName,
              page: 1,
              filter: {},
            })}`}
            target="_blank"
            className={styles.journalName}
          >
            {journalName}
          </a>
        ) : null}

        {journalIF ? <span className={styles.bold}>{`[IF: ${journalIF.toFixed(2)}]`}</span> : null}
        {journalName ? <div className={styles.separatorLine} /> : null}
        {year ? <span className={styles.bold}>{year}</span> : null}
        {year ? <div className={styles.separatorLine} /> : null}
        <Authors authors={authors} isAuthorsOpen={isAuthorsOpen} toggleAuthors={toggleAuthors} />
      </div>
    );
  }
}

export default withStyles<typeof PublishInfoList>(styles)(PublishInfoList);
