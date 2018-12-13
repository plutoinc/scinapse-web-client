import * as React from "react";
import { Link } from "react-router-dom";
import Tooltip from "../tooltip/tooltip";
import { PaperAuthor } from "../../../model/author";
import { withStyles } from "../../../helpers/withStylesHelper";
import { trackEvent } from "../../../helpers/handleGA";
import GlobalDialogManager from "../../../helpers/globalDialogManager";
import { Paper } from "../../../model/paper";
const styles = require("./authors.scss");

const MINIMUM_SHOWING_AUTHOR_NUMBER = 3;

export interface AuthorsProps {
  authors: PaperAuthor[];
  paper: Paper;
  style?: React.CSSProperties;
  readOnly?: boolean;
}

class Authors extends React.PureComponent<AuthorsProps> {
  public render() {
    const { authors } = this.props;

    const isAuthorsSameLessThanMinimumShowingAuthorNumber = authors.length <= MINIMUM_SHOWING_AUTHOR_NUMBER;

    if (isAuthorsSameLessThanMinimumShowingAuthorNumber) {
      const endIndex = authors.length - 1;
      const authorItems = this.mapAuthorNodeToEndIndex(authors, endIndex);

      return <span className={styles.authors}>{authorItems}</span>;
    } else {
      const endIndex = MINIMUM_SHOWING_AUTHOR_NUMBER - 1;
      const authorItems = this.mapAuthorNodeToEndIndex(authors, endIndex);

      return (
        <span className={styles.authors}>
          {authorItems}
          <span className={styles.toggleAuthorsButton} onClick={this.toggleAuthors}>
            ... more
          </span>
        </span>
      );
    }
  }

  private toggleAuthors = () => {
    const { paper } = this.props;
    return GlobalDialogManager.openAuthorListDialog(paper);
  };

  private getHIndexTooltip = (hIndex: number) => {
    if (!!hIndex) {
      return (
        <span className={styles.authorHIndex}>
          <span className={styles.hIndexChar}>{hIndex}</span>
          <Tooltip
            className={styles.authorHIndexTooltip}
            left={-55}
            top={-42}
            iconTop={-9}
            content={`Estimated H-index: ${hIndex}`}
            type="h-index"
          />
        </span>
      );
    }
  };

  private getAuthorOrganization = (organization: string) => {
    if (!!organization) {
      const trimmedOrganization = organization
        .split(",")
        .slice(0, 2)
        .join();

      return `(${trimmedOrganization})`;
    }
    return "";
  };

  private mapAuthorNodeToEndIndex = (authors: PaperAuthor[], endIndex: number) => {
    const { style, readOnly } = this.props;

    return authors.slice(0, endIndex + 1).map((author, index) => {
      if (author) {
        const isLastAuthor = index === endIndex;
        const authorNode = readOnly ? (
          <span className={styles.authorName}>{author.name}</span>
        ) : (
          <Link
            to={`/authors/${author.id}`}
            onClick={() => {
              trackEvent({
                category: "New Paper Show",
                action: "Click Author in publishInfoList",
                label: `Click to Author ID : ${author.id}`,
              });
            }}
            className={styles.authorName}
          >
            {author.name}
          </Link>
        );

        return (
          <span style={style} className={styles.author} key={`author_${index}`}>
            {authorNode}
            {this.getHIndexTooltip(author.hindex)}
            {` ${this.getAuthorOrganization(author.organization)}`}
            {!isLastAuthor ? <span>{`, `}</span> : null}
          </span>
        );
      }
    });
  };
}
export default withStyles<typeof Authors>(styles)(Authors);
