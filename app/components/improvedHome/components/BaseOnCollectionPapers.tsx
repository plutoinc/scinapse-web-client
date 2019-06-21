import * as React from 'react';
import { Link } from 'react-router-dom';
import * as format from 'date-fns/format';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '../../../helpers/withStylesHelper';
import { Collection } from '../../../model/collection';
import { Paper } from '../../../model/paper';
import { BasedOnCollectionPapersParams } from '../../../api/home';
const styles = require('./recommendedPapers.scss');

const PaperItem: React.FC<{ paper: Paper; collectionTitle: string; collectionId: number }> = ({
  paper,
  collectionTitle,
  collectionId,
}) => {
  const { id, publishedDate, authors, journal, title } = paper;

  const yearStr = publishedDate ? (
    <span>
      Published on <span className={styles.detailInfo}>{`${format(publishedDate, 'MMM D, YYYY')} · `}</span>
    </span>
  ) : null;

  const authorName = authors &&
    authors.length > 0 && (
      <Link to={`/authors/${authors[0].id}`} className={styles.authorInfo}>{`${authors[0].name}`}</Link>
    );

  const journalTitle = journal ? ` (${journal.title})` : '';

  return (
    <div key={id} className={styles.basedOnCollectionPapersItemWrapper}>
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

const CollectionPapers: React.FC<{ collection: Collection; papers: Paper[]; isLoading: boolean }> = ({
  collection,
  papers,
  isLoading,
}) => {
  if (isLoading) return <CircularProgress size={36} thickness={4} style={{ color: '#e7eaef' }} />;

  const { id, title } = collection;

  const collectionPapers =
    collection &&
    papers &&
    papers.map(paper => <PaperItem key={paper.id} paper={paper} collectionId={id} collectionTitle={title} />);

  return <>{collectionPapers}</>;
};

const BaseOnCollectionPapers: React.FC<{
  basedOnCollectionPapers: BasedOnCollectionPapersParams;
  isLoading: boolean;
}> = ({ basedOnCollectionPapers, isLoading }) => {
  return (
    <>
      <div className={styles.sectionTitle}>
        {basedOnCollectionPapers && (
          <Link to={`/collections/${basedOnCollectionPapers.collection.id}`} className={styles.collectionLink}>
            Go to Collection
          </Link>
        )}
        <span className={styles.sectionTitleContext}>{`Recommendation\nbased on your collection`}</span>
      </div>
      <div className={styles.sectionContent}>
        {basedOnCollectionPapers && basedOnCollectionPapers.recommendations.length > 0 ? (
          <CollectionPapers
            collection={basedOnCollectionPapers.collection}
            papers={basedOnCollectionPapers.recommendations}
            isLoading={isLoading}
          />
        ) : (
          <div className={styles.noPaperContext}>you haven't added any papers to collection</div>
        )}
      </div>
    </>
  );
};

export default withStyles<typeof BaseOnCollectionPapers>(styles)(BaseOnCollectionPapers);
