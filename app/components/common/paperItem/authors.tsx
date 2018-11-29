import * as React from "react";
import { Link } from "react-router-dom";
import Tooltip from "../tooltip/tooltip";
import { PaperAuthor } from "../../../model/author";
import { withStyles } from "../../../helpers/withStylesHelper";
import { trackEvent } from "../../../helpers/handleGA";
const styles = require("./authors.scss");

const MINIMUM_SHOWING_AUTHOR_NUMBER = 3;

export interface AuthorsProps {
  authors: PaperAuthor[];
  style?: React.CSSProperties;
  readOnly?: boolean;
}

interface AuthorsStates {
  isAuthorsOpen: boolean;
}

class Authors extends React.PureComponent<AuthorsProps, AuthorsStates> {
  public constructor(props: AuthorsProps) {
    super(props);

    this.state = {
      isAuthorsOpen: false,
    };
  }

  public render() {
    const { authors } = this.props;
    const { isAuthorsOpen } = this.state;

    const isAuthorsSameLessThanMinimumShowingAuthorNumber = authors.length <= MINIMUM_SHOWING_AUTHOR_NUMBER;

    if (isAuthorsSameLessThanMinimumShowingAuthorNumber) {
      const endIndex = authors.length - 1;
      const authorItems = this.mapAuthorNodeToEndIndex(authors, endIndex);

      return <span className={styles.authors}>{authorItems}</span>;
    } else if (!isAuthorsOpen) {
      const endIndex = MINIMUM_SHOWING_AUTHOR_NUMBER - 1;
      const authorItems = this.mapAuthorNodeToEndIndex(authors, endIndex);

      return (
        <span className={styles.authors}>
          {authorItems}
          <span className={styles.toggleAuthorsButton} onClick={this.toggleAuthors}>
            {` ... (${authors.length - MINIMUM_SHOWING_AUTHOR_NUMBER} others)`}
          </span>
        </span>
      );
    } else {
      const endIndex = authors.length - 1;
      const authorItems = this.mapAuthorNodeToEndIndex(authors, endIndex);

      return (
        <span className={styles.authors}>
          {authorItems}
          <span className={styles.toggleAuthorsButton} onClick={this.toggleAuthors}>
            {` ... (less)`}
          </span>
        </span>
      );
    }
  }

  private toggleAuthors = () => {
    this.setState({
      isAuthorsOpen: !this.state.isAuthorsOpen,
    });
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
                category: "Flow to Author Show",
                action: "Click Author",
                label: "",
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
