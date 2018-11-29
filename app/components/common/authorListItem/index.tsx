import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import HIndexBox from "../hIndexBox";
import { PaperAuthor } from "../../../model/author";

const styles = require("./authorListItem.scss");

interface AuthorListItemProps {
  author: PaperAuthor;
}

class AuthorListItem extends React.PureComponent<AuthorListItemProps, {}> {
  public render() {
    const { author } = this.props;

    return (
      <div className={styles.itemWrapper}>
        <span className={styles.authorName}>{author.name}</span>
        <span className={styles.affiliation}>{author.affiliation ? author.affiliation.name : ""}</span>
        <span className={styles.hIndexBox}>
          <HIndexBox hIndex={author.hindex} />
        </span>
      </div>
    );
  }
}

export default withStyles<typeof AuthorListItem>(styles)(AuthorListItem);
