import * as React from 'react';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '../../../helpers/withStylesHelper';
import { Collection } from '../../../model/collection';
import { Paper } from '../../../model/paper';
import { BasedOnCollectionPapersParams } from '../../../api/home';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import CollectionPaperItem from './BasedOnCollectionPaperItem';
const styles = require('./recommendedPapers.scss');

interface BasedOnCollectionPapersProps {
  collection: Collection;
  papers: Paper[];
  isLoading: boolean;
}

interface BasedOnCollectionPaperListProps {
  basedOnCollectionPapers: BasedOnCollectionPapersParams | undefined;
  isLoading: boolean;
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

const BasedOnCollectionPaperListContainer: React.FC<{
  headerCollectionBtn: JSX.Element | null;
  paperList: JSX.Element;
}> = props => {
  const { headerCollectionBtn, paperList } = props;

  return (
    <>
      <div className={styles.sectionTitle}>
        {headerCollectionBtn}
        <span className={styles.sectionTitleContext}>{`Recommendations\nbased on your collection`}</span>
      </div>
      <div className={styles.sectionContent}>{paperList}</div>
    </>
  );
};

const BaseOnCollectionPaperList: React.FC<BasedOnCollectionPaperListProps> = props => {
  const { basedOnCollectionPapers, isLoading } = props;
  let goToCollectionBtn = null;
  let papersContent = <div className={styles.noPaperContext}>you haven't added any papers to collection</div>;

  if (!basedOnCollectionPapers)
    return <BasedOnCollectionPaperListContainer headerCollectionBtn={goToCollectionBtn} paperList={papersContent} />;

  const { collection, recommendations } = basedOnCollectionPapers;

  if (collection) {
    goToCollectionBtn = (
      <Link
        to={`/collections/${collection.id}`}
        className={styles.collectionLink}
        onClick={() => {
          trackToBasedOnCollectionPaper('clickGoToCollectionBtn', null);
        }}
      >
        Go to Collection
      </Link>
    );
  }

  if (recommendations && recommendations.length > 0) {
    papersContent = <BasedOnCollectionPapers collection={collection} papers={recommendations} isLoading={isLoading} />;
  }

  return <BasedOnCollectionPaperListContainer headerCollectionBtn={goToCollectionBtn} paperList={papersContent} />;
};

export default withStyles<typeof BaseOnCollectionPaperList>(styles)(BaseOnCollectionPaperList);
