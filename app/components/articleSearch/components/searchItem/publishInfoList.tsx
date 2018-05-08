import * as React from "react";
import { Link } from "react-router-dom";
import Authors, { AuthorsProps } from "./authors";
import { withStyles } from "../../../../helpers/withStylesHelper";
import papersQueryFormatter from "../../../../helpers/papersQueryFormatter";
import { trackAndOpenLink } from "../../../../helpers/handleGA";
const styles = require("./publishInfoList.scss");

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
          <Link
            to={{
              pathname: "/search",
              search: papersQueryFormatter.stringifyPapersQuery({
                query: journalName,
                sort: "RELEVANCE",
                page: 1,
                filter: {},
              }),
            }}
            onClick={() => {
              trackAndOpenLink("SearchItemJournal");
            }}
            className={styles.journalName}
          >
            {journalName}
          </Link>
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
