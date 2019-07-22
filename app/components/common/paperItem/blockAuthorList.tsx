import * as React from 'react';
import { Link } from 'react-router-dom';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { withStyles } from '../../../helpers/withStylesHelper';
import { PaperAuthor } from '../../../model/author';
import Icon from '../../../icons';
import { Paper } from '../../../model/paper';
const styles = require('./blockAuthorList.scss');

const MAXIMUM_PRE_AUTHOR_COUNT = 2;
const MAXIMUM_POST_AUTHOR_COUNT = 1;

interface BlockAuthorListProps {
  paper: Paper;
  authors: PaperAuthor[];
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}

interface AuthorItemProps {
  author: PaperAuthor;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}

const AuthorItem: React.FC<AuthorItemProps> = ({ author, pageType, actionArea }) => {
  let affiliation = null;
  if (author.affiliation) {
    const affiliationName = author.affiliation.nameAbbrev
      ? `${author.affiliation.nameAbbrev} - ${author.affiliation.name}`
      : author.affiliation.name;
    affiliation = <span className={styles.affiliation}>{`(${affiliationName})`}</span>;
  }

  let hIndex = null;
  if (author.hindex) {
    hIndex = <span className={styles.hIndex}>{`H-Index: ${author.hindex}`}</span>;
  }

  return (
    <span className={styles.authorContentWrapper}>
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
      {author.name && author.affiliation && ' '}
      {affiliation}
      {hIndex}
    </span>
  );
};

const BlockAuthorList: React.FC<BlockAuthorListProps> = ({ paper, authors, pageType, actionArea }) => {
  const hasMore = authors.length > MAXIMUM_PRE_AUTHOR_COUNT + MAXIMUM_POST_AUTHOR_COUNT;
  let viewAllAuthorsBtn = null;
  if (hasMore) {
    viewAllAuthorsBtn = (
      <div
        onClick={() => {
          GlobalDialogManager.openAuthorListDialog(paper);
        }}
        className={styles.viewAll}
      >{`view all ${authors.length} authors...`}</div>
    );
  }

  const preAuthorList = authors.slice(0, MAXIMUM_PRE_AUTHOR_COUNT).map((author, index) => {
    return (
      <div key={author.id}>
        <span className={styles.marker}>
          {`#`}
          <span className={styles.markerNum}>{index + 1}</span>
        </span>
        <AuthorItem author={author} pageType={pageType} actionArea={actionArea} />
      </div>
    );
  });

  const postAuthorList =
    hasMore &&
    authors.slice(-MAXIMUM_POST_AUTHOR_COUNT).map(author => {
      return (
        <div key={author.id}>
          <span style={{ fontWeight: 'bold' }} className={styles.marker}>
            Last.
          </span>
          <AuthorItem author={author} pageType={pageType} actionArea={actionArea} />
        </div>
      );
    });

  return (
    <div className={styles.authorListWrapper}>
      <Icon className={styles.authorIcon} icon="AUTHOR" />
      <span className={styles.listWrapper}>
        {preAuthorList}
        {postAuthorList}
        {viewAllAuthorsBtn}
      </span>
    </div>
  );
};

export default withStyles<typeof BlockAuthorList>(styles)(BlockAuthorList);
