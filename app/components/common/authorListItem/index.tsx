import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Author } from "../../../model/author/author";
import HIndexBox from "../hIndexBox";

const styles = require("./authorListItem.scss");

interface AuthorListItemProps {
  author: Author;
}

class AuthorListItem extends React.PureComponent<AuthorListItemProps, {}> {
  public render() {
    const { author } = this.props;

    return (
      <div className={styles.itemWrapper}>
        <span className={styles.authorName}>{author.name}</span>
        <span className={styles.affiliation}>
          {author.lastKnownAffiliation ? author.lastKnownAffiliation.name : "Author Affiliation"}
        </span>
        <span className={styles.hIndexBox}>
          <HIndexBox hIndex={author.hIndex || 5} />
        </span>
      </div>
    );
  }
}

export default withStyles<typeof AuthorListItem>(styles)(AuthorListItem);
