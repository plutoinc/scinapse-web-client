import * as React from "react";
import { Link } from "react-router-dom";
import Authors, { AuthorsProps } from "./authors";
import { withStyles } from "../../../helpers/withStylesHelper";
import papersQueryFormatter from "../../../helpers/papersQueryFormatter";
import { trackAndOpenLink } from "../../../helpers/handleGA";
import Icon from "../../../icons";
const styles = require("./publishInfoList.scss");

export interface PublishInfoListProps extends AuthorsProps {
  journalName: string;
  journalIF: number;
  year: number;
}

class PublishInfoList extends React.PureComponent<PublishInfoListProps, {}> {
  public render() {
    const { journalName, journalIF, year, authors } = this.props;

    return (
      <div className={styles.publishInfoList}>
        {journalName ? (
          <div className={styles.journal}>
            <Icon icon="JOURNAL" />
            {year ? (
              <span className={styles.bold}>
                {year}
                {` in `}
              </span>
            ) : null}
            <Link
              to={{
                pathname: "/search",
                search: papersQueryFormatter.stringifyPapersQuery({
                  query: journalName,
                  sort: "NEWEST_FIRST",
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
            {journalIF ? <span className={styles.bold}>{` [IF: ${journalIF.toFixed(2)}]`}</span> : null}
          </div>
        ) : null}

        {authors ? (
          <div className={styles.author}>
            <Icon icon="AUTHOR" />
            <Authors authors={authors} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default withStyles<typeof PublishInfoList>(styles)(PublishInfoList);
