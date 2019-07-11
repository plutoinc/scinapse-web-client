import React from 'react';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import { withStyles } from '../../../helpers/withStylesHelper';
import { Paper } from '../../../model/paper';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { ActionTicketParams } from '../../../helpers/actionTicketManager/actionTicket';
import { useObserver } from '../../../hooks/useIntersectionHook';
const styles = require('./recommendedPapers.scss');

interface BasedOnCollectionPaperItemProps {
  paper: Paper;
  collectionTitle: string;
  collectionId: number;
}

export function trackToBasedOnCollectionPaper(
  actionTag: Scinapse.ActionTicket.ActionTagType,
  actionLabel: string | null
) {
  ActionTicketManager.trackTicket({
    pageType: 'home',
    actionType: 'fire',
    actionArea: 'basedOnCollectionPaperList',
    actionTag,
    actionLabel,
  });
}

const CollectionPaperItem: React.FC<BasedOnCollectionPaperItemProps> = props => {
  const { paper, collectionTitle, collectionId } = props;
  const { id, publishedDate, authors, journal, title } = paper;

  let yearStr = null;
  let authorInfo = null;
  let journalTitle = null;
  let affiliationInfo = null;

  if (publishedDate) {
    yearStr = (
      <span>
        Published on <span className={styles.detailInfo}>{`${format(publishedDate, 'MMM D, YYYY')}`}</span>
      </span>
    );
  }

  if (authors && authors.length > 0) {
    if (authors[0].affiliation) {
      affiliationInfo = <span className={styles.affiliationInfo}>{`(${authors[0].affiliation.name})`}</span>;
    }

    authorInfo = (
      <span>
        {` · `}
        <Link
          to={`/authors/${authors[0].id}`}
          className={styles.authorInfo}
          onClick={() => {
            trackToBasedOnCollectionPaper('authorShow', String(authors[0].id));
          }}
        >
          {authors[0].name}
        </Link>{' '}
        {affiliationInfo}
      </span>
    );
  }

  if (journal) {
    journalTitle = (
      <span>
        {' '}
        in{' '}
        <Link
          to={`/journals/${journal.id}`}
          className={styles.journalInfo}
          onClick={() => {
            trackToBasedOnCollectionPaper('journalShow', String(journal.id));
          }}
        >{` ${journal.title}`}</Link>{' '}
      </span>
    );
  }

  const actionTicketContext: ActionTicketParams = {
    pageType: 'home',
    actionType: 'view',
    actionArea: 'basedOnCollectionPaperList',
    actionTag: 'viewBasedOnCollectionPaper',
    actionLabel: String(id),
  };

  const { elRef } = useObserver(0.1, actionTicketContext);

  return (
    <div ref={elRef} className={styles.basedOnCollectionPapersItemWrapper}>
      <div className={styles.fromCollectionInfo}>
        from{' '}
        <Link
          to={`/collections/${collectionId}`}
          className={styles.fromCollectionLink}
          onClick={() => {
            trackToBasedOnCollectionPaper('collectionShow', String(collectionId));
          }}
        >
          {collectionTitle}
        </Link>
      </div>
      <Link
        to={`/papers/${id}`}
        className={styles.paperTitle}
        onClick={() => {
          trackToBasedOnCollectionPaper('paperShow', String(id));
        }}
      >
        {title}
      </Link>
      <div className={styles.publishInfo}>
        {yearStr}
        {journalTitle}
        <span className={styles.detailInfo}>{authorInfo}</span>
      </div>
    </div>
  );
};

export default withStyles<typeof CollectionPaperItem>(styles)(CollectionPaperItem);
