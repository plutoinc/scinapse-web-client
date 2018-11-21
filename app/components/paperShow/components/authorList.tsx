import * as React from "react";
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

class PaperAuthorList extends React.PureComponent<PaperAuthorListProps, {}> {
  public render() {
    const { authors } = this.props;

    return (
      <div className={styles.authors}>
        <div className={styles.paperContentBlockHeader}>
          Authors
          {authors.length > 3 ? (
            <button className={styles.tinyButton}>
              <Icon icon="AUTHOR_MORE_ICON" />
              <span>View {authors.length + 1} Authors</span>
            </button>
          ) : null}
        </div>
        <ul className={styles.authorList}>{this.getAutorsList(authors)}</ul>
      </div>
    );
  }

  private getAutorsList(authors: PaperAuthor[]) {
    return authors.map((author, index) => {
      if ((author && index < 2) || index == authors.length - 1) {
        return (
          <li className={styles.authorItem} key={`$${author.id}_${index}`}>
            <Author author={author} />
          </li>
        );
      } else if (author && index == 3) {
        return (
          <div className={styles.authorListHideLayer} key={`$${author.id}_${index}`}>
            <button className={styles.authorListHideLayerButton}>
              <Icon icon="TILDE" />
            </button>
          </div>
        );
      }
    });
  }
}

export default withStyles<typeof PaperAuthorList>(styles)(PaperAuthorList);
