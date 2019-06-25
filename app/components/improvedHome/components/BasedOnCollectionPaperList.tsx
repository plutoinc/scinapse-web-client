import * as React from 'react';
import { Link } from 'react-router-dom';
import * as format from 'date-fns/format';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '../../../helpers/withStylesHelper';
import { Collection } from '../../../model/collection';
import { Paper } from '../../../model/paper';
import { BasedOnCollectionPapersParams } from '../../../api/home';
import { ActionTicketParams } from '../../../helpers/actionTicketManager/actionTicket';
import { useObserver } from '../../../hooks/useIntersectionHook';
const styles = require('./recommendedPapers.scss');

interface BasedOnCollectionPaperItemProps {
  paper: Paper;
  collectionTitle: string;
  collectionId: number;
}

interface BasedOnCollectionPapersProps {
  collection: Collection;
  papers: Paper[];
  isLoading: boolean;
}

interface BasedOnCollectionPaperListProps {
  basedOnCollectionPapers: BasedOnCollectionPapersParams;
  isLoading: boolean;
}

const CollectionPaperItem: React.FC<BasedOnCollectionPaperItemProps> = props => {
  const { paper, collectionTitle, collectionId } = props;
  const { id, publishedDate, authors, journal, title } = paper;

  let yearStr = null;
  let authorName = null;
  let journalTitle = '';

  if (publishedDate) {
    yearStr = (
      <span>
        Published on <span className={styles.detailInfo}>{`${format(publishedDate, 'MMM D, YYYY')} · `}</span>
      </span>
    );
  }

  if (authors && authors.length > 0) {
    authorName = <Link to={`/authors/${authors[0].id}`} className={styles.authorInfo}>{`${authors[0].name}`}</Link>;
  }

  if (journal) {
    journalTitle = ` (${journal.title})`;
  }

  const actionTicketContext: ActionTicketParams = {
    pageType: 'home',
    actionType: 'view',
    actionArea: 'baseOnCollectionPaperList',
    actionTag: 'viewBaseOnCollectionPaper',
    actionLabel: String(id),
  };

  const { elRef } = useObserver(0.1, actionTicketContext);

  return (
    <div ref={elRef} className={styles.basedOnCollectionPapersItemWrapper}>
      <div className={styles.fromCollectionInfo}>
        from{' '}
        <Link to={`/collections/${collectionId}`} className={styles.fromCollectionLink}>
          {collectionTitle}
        </Link>
      </div>
      <Link to={`/papers/${id}`} className={styles.paperTitle}>
        {title}
      </Link>
      <div className={styles.publishInfo}>
        {yearStr}
        <span className={styles.detailInfo}>
          {authorName}
          {journalTitle}
        </span>
      </div>
    </div>
  );
};

const BasedOnCollectionPapers: React.FC<BasedOnCollectionPapersProps> = props => {
  const { collection, papers, isLoading } = props;
  const { id, title } = collection;

  if (isLoading) return <CircularProgress size={36} thickness={4} style={{ color: '#e7eaef' }} />;

  const collectionPapers =
    collection &&
    papers &&
    papers.map(paper => <CollectionPaperItem key={paper.id} paper={paper} collectionId={id} collectionTitle={title} />);

  return <>{collectionPapers}</>;
};

const BaseOnCollectionPaperList: React.FC<BasedOnCollectionPaperListProps> = props => {
  const { basedOnCollectionPapers, isLoading } = props;
  const { collection, recommendations } = !!basedOnCollectionPapers && basedOnCollectionPapers;

  let goToCollectionBtn = null;
  let papersContent = <div className={styles.noPaperContext}>you haven't added any papers to collection</div>;

  if (collection) {
    goToCollectionBtn = (
      <Link to={`/collections/${collection.id}`} className={styles.collectionLink}>
        Go to Collection
      </Link>
    );
  }

  if (recommendations && recommendations.length > 0) {
    papersContent = <BasedOnCollectionPapers collection={collection} papers={recommendations} isLoading={isLoading} />;
  }

  return (
    <>
      <div className={styles.sectionTitle}>
        {goToCollectionBtn}
        <span className={styles.sectionTitleContext}>{`Recommendation\nbased on your collection`}</span>
      </div>
      <div className={styles.sectionContent}>{papersContent}</div>
    </>
  );
};

export default withStyles<typeof BaseOnCollectionPaperList>(styles)(BaseOnCollectionPaperList);
