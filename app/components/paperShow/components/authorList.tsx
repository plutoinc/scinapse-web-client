import * as React from "react";
import { Link } from "react-router-dom";
import Author from "./author";
import { withStyles } from "../../../helpers/withStylesHelper";
import { PaperAuthor } from "../../../model/author";
import { LayoutState } from "../../layouts/records";
import Icon from "../../../icons";
const styles = require("./authorList.scss");

interface PaperAuthorListProps {
  layout: LayoutState;
  authors: PaperAuthor[];
}

interface AuthorListProps {
  authors: PaperAuthor[];
}

const AuthorList: React.SFC<AuthorListProps> = props => {
  const authorNodes = props.authors.map((author, index) => {
    const lastOrderAuthor = index === props.authors.length - 1;
    if ((author && index < 2) || lastOrderAuthor) {
      return (
        <li className={styles.authorItem} key={author.id}>
          <Link className={styles.authorItemAnchor} to={`/authors/${author.id}`}>
            <Author author={author} />
          </Link>
        </li>
      );
    }
  });

  return <>{authorNodes}</>;
};

const PaperAuthorList: React.SFC<PaperAuthorListProps> = props => {
  const { authors } = props;

  return (
    <div className={styles.authors}>
      <div className={styles.paperContentBlockHeader}>
        Authors
        {authors.length > 3 && (
          <button className={styles.tinyButton}>
            <Icon icon="AUTHOR_MORE_ICON" />
            <span>View {authors.length + 1} Authors</span>
          </button>
        )}
      </div>
      <ul className={styles.authorList}>
        <AuthorList authors={authors} />
      </ul>
    </div>
  );
};

export default withStyles<typeof PaperAuthorList>(styles)(PaperAuthorList);
