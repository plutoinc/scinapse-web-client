import * as React from "react";
import { Link } from "react-router-dom";
import Author from "./author";
import { withStyles } from "../../../helpers/withStylesHelper";
import { PaperAuthor } from "../../../model/author";
import Icon from "../../../icons";
import GlobalDialogManager from "../../../helpers/globalDialogManager";
import { Paper } from "../../../model/paper";
import { trackEvent } from "../../../helpers/handleGA";
const styles = require("./authorList.scss");

interface AuthorListProps {
  paper: Paper;
  authors: PaperAuthor[];
}

const AuthorList: React.SFC<{ authors: PaperAuthor[] }> = props => {
  const authorNodes = props.authors.map((author, index) => {
    const lastOrderAuthor = index === props.authors.length - 1;
    if ((author && index < 2) || lastOrderAuthor) {
      return (
        <li className={styles.authorItem} key={author.id}>
          <Link
            className={styles.authorItemAnchor}
            to={`/authors/${author.id}`}
            onClick={() =>
              trackEvent({
                category: "New Paper Show",
                action: "Click Author in PaperInfo Section",
                label: `Click Author ID : ${author.id}`,
              })
            }
          >
            <Author author={author} />
          </Link>
        </li>
      );
    } else if (author && index === 3) {
      return (
        <div className={styles.authorListHideLayer} key={author.id}>
          <button className={styles.authorListHideLayerButton}>
            <Icon icon="TILDE" />
          </button>
        </div>
      );
    }
  });

  return <>{authorNodes}</>;
};

const PaperAuthorList: React.SFC<AuthorListProps> = props => {
  const { authors } = props;

  function handleClickButton() {
    GlobalDialogManager.openAuthorListDialog(props.paper);
    trackEvent({
      category: "New Paper Show",
      action: "Click more button in PaperInfo Section",
      label: "Click more button for Open Author List",
    });
  }

  return (
    <div className={styles.authors}>
      <div className={styles.paperContentBlockHeader}>
        Authors
        {authors.length > 3 && (
          <button onClick={handleClickButton} className={styles.tinyButton}>
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
