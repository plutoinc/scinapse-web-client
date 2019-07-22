import * as React from 'react';
import { Link } from 'react-router-dom';
import * as classNames from 'classnames';
import { PaperAuthor } from '../../../model/author';
import { withStyles } from '../../../helpers/withStylesHelper';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import { Paper } from '../../../model/paper';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { Affiliation } from '../../../model/affiliation';
const styles = require('./authors.scss');

const MINIMUM_SHOWING_AUTHOR_NUMBER = 3;

export interface AuthorsProps {
  authors: PaperAuthor[];
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
  style?: React.CSSProperties;
  readOnly?: boolean;
  disableTruncate?: boolean;
}

class Authors extends React.PureComponent<AuthorsProps> {
  public render() {
    const { authors, disableTruncate, paper } = this.props;

    const isAuthorsSameLessThanMinimumShowingAuthorNumber = authors.length <= MINIMUM_SHOWING_AUTHOR_NUMBER;

    if (disableTruncate) {
      const endIndex = MINIMUM_SHOWING_AUTHOR_NUMBER - 1;
      const authorItems = this.mapAuthorNodeToEndIndex(authors, endIndex, false);

      return <span className={styles.authors}>{authorItems}</span>;
    }

    if (isAuthorsSameLessThanMinimumShowingAuthorNumber) {
      const endIndex = authors.length - 1;
      const authorItems = this.mapAuthorNodeToEndIndex(authors, endIndex, false);

      return <span className={styles.authors}>{authorItems}</span>;
    } else {
      const authorItems = this.mapAuthorNodeToEndIndex(authors, 1, true);

      return (
        <span className={styles.authors}>
          {authorItems.slice(0, 2)}
          <span className={styles.toggleAuthorsButton} onClick={this.toggleAuthors}>
            {`+ ${paper.authorCount - 3} Authors`}
          </span>
          {authorItems[2]}
        </span>
      );
    }
  }

  private toggleAuthors = () => {
    const { paper } = this.props;
    return GlobalDialogManager.openAuthorListDialog(paper);
  };

  private getHIndexTooltip = (hIndex?: number) => {
    if (!hIndex) return null;

    return (
      <span className={styles.authorHIndex}>
        <span className={styles.hIndexChar}>{hIndex}</span>
        <div className={styles.detailHIndexBox}>
          <div className={styles.contentWrapper}>{`Estimated H-index: ${hIndex}`}</div>
        </div>
      </span>
    );
  };

  private getAuthorOrganization = (affiliation: Affiliation | null) => {
    if (!affiliation) return '';

    const trimmedOrganization = affiliation.name
      .split(',')
      .slice(0, 2)
      .join();

    let abbrev = '';
    if (affiliation.nameAbbrev) {
      abbrev = `${affiliation.nameAbbrev} - `;
    }

    return `(${abbrev}${trimmedOrganization}) `;
  };

  private mapAuthorNodeToEndIndex = (authors: PaperAuthor[], endIndex: number, isSliced: boolean) => {
    const { style, readOnly, pageType, actionArea } = this.props;

    const slicedAuthors = authors.slice(0, endIndex + 1);
    let finalAuthors: PaperAuthor[];

    if (isSliced) {
      finalAuthors = [...slicedAuthors, authors[authors.length - 1]];
    } else {
      finalAuthors = [...slicedAuthors];
    }

    return finalAuthors.map((author, index) => {
      if (author) {
        const isLastAuthor = index === endIndex || index === finalAuthors.length - 1;

        const authorNode = readOnly ? (
          <span
            className={classNames({
              [styles.authorName]: true,
              [styles.noUnderlineAuthorName]: style !== null,
            })}
          >
            {author.name}
          </span>
        ) : (
          <Link
            to={`/authors/${author.id}`}
            onClick={() => {
              ActionTicketManager.trackTicket({
                pageType,
                actionType: 'fire',
                actionArea: actionArea || pageType,
                actionTag: 'authorShow',
                actionLabel: String(author.id),
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
            {` ${this.getAuthorOrganization(author.affiliation)}`}
            {!isLastAuthor ? <span>{`, `}</span> : null}
          </span>
        );
      }
    });
  };
}

export default withStyles<typeof Authors>(styles)(Authors);
