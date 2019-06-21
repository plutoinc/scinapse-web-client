import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '../../../helpers/withStylesHelper';
import * as format from 'date-fns/format';
import SkeletonPaperItem from '../../common/skeletonPaperItem/skeletonPaperItem';
import homeAPI, { GetBasedOnCollectionPapersParams } from '../../../api/home';
import PaperItem from '../../common/paperItem';
import { Paper } from '../../../model/paper';
import Icon from '../../../icons';
import classNames from 'classnames';
import { Collection } from '../../../model/collection';
import { Link } from 'react-router-dom';
const styles = require('./recommendedPapers.scss');

const BaseOnActivityPapers: React.FC<{ isLoading: boolean; papers: Paper[] }> = ({ isLoading, papers }) => {
  const [isBasedOnActivityPapersExpanding, setIsBasedOnActivityPapersExpanding] = React.useState(false);

  if (!papers) return null;

  const targetPapers = isBasedOnActivityPapersExpanding ? papers : papers.slice(0, 5);

  const moreButton =
    papers.length <= 5 ? null : (
      <div
        onClick={() => {
          setIsBasedOnActivityPapersExpanding(!isBasedOnActivityPapersExpanding);
        }}
        className={styles.moreItem}
      >
        {isBasedOnActivityPapersExpanding ? 'See less' : 'See More'}
        <Icon
          icon="ARROW_POINT_TO_DOWN"
          className={classNames({
            [styles.downIcon]: !isBasedOnActivityPapersExpanding,
            [styles.upIcon]: isBasedOnActivityPapersExpanding,
          })}
        />
      </div>
    );

  if (isLoading)
    return (
      <>
        <SkeletonPaperItem />
        <SkeletonPaperItem />
        <SkeletonPaperItem />
        <SkeletonPaperItem />
        <SkeletonPaperItem />
      </>
    );

  const activityPapers = targetPapers.map(paper => {
    return (
      <PaperItem
        key={paper.id}
        paper={paper}
        omitAbstract={true}
        pageType="collectionShow"
        actionArea="relatedPaperList"
        wrapperClassName={styles.paperItemWrapper}
      />
    );
  });

  return (
    <>
      {activityPapers}
      {moreButton}
    </>
  );
};

const CollectionPapers: React.FC<{ collection: Collection; papers: Paper[]; isLoading: boolean }> = ({
  collection,
  papers,
  isLoading,
}) => {
  if (isLoading) return <CircularProgress size={36} thickness={4} style={{ color: '#e7eaef' }} />;

  const collectionPapers =
    collection &&
    papers &&
    papers.map(paper => {
      const yearStr = paper.publishedDate ? (
        <span>
          Published on <span className={styles.detailInfo}>{`${format(paper.publishedDate, 'MMM D, YYYY')} · `}</span>
        </span>
      ) : null;
      const authorName = (
        <Link to={`/authors/${paper.authors[0].id}`} className={styles.authorInfo}>{`${paper.authors[0].name}`}</Link>
      );
      const journalTitle = paper.journal ? ` (${paper.journal.title})` : '';

      return (
        <div key={paper.id} className={styles.basedOnCollectionPapersItemWrapper}>
          <div className={styles.fromCollectionInfo}>
            from{' '}
            <Link to={`/collections/${collection.id}`} className={styles.fromCollectionLink}>
              {collection.title}
            </Link>
          </div>
          <Link to={`/papers/${paper.id}`} className={styles.paperTitle}>
            {paper.title}
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
    });

  return <>{collectionPapers}</>;
};

const RecommendedPapers: React.FC<{ isLoggedIn: boolean; isLoggingIn: boolean }> = props => {
  const [isLoadingActivityPapers, setIsLoadingActivityPapers] = React.useState(false);
  const [isLoadingCollectionPapers, setIsLoadingCollectionPapers] = React.useState(false);

  const [basedOnCollectionPapers, setOnBasedOnCollectionPapers] = React.useState<GetBasedOnCollectionPapersParams>();
  const [basedOnActivityPapers, setOnBasedOnActivityPapers] = React.useState<Paper[]>([]);

  React.useEffect(
    () => {
      if (props.isLoggedIn) {
        setIsLoadingActivityPapers(true);
        setIsLoadingCollectionPapers(true);
        homeAPI.getBasedOnActivityPapers().then(res => {
          setOnBasedOnActivityPapers(res);
          setIsLoadingActivityPapers(false);
        });

        homeAPI.getBasedOnCollectionPapers().then(res => {
          setOnBasedOnCollectionPapers(res);
          setIsLoadingCollectionPapers(false);
        });
      }
    },
    [props.isLoggedIn]
  );

  if (!props.isLoggedIn) return null;

  return (
    <div className={styles.recommendedPapersContainer}>
      <div className={styles.titleSection}>
        <div className={styles.title}>Recommended papers based on your activity</div>
        <div className={styles.subTitle}>BASED ON YOUR SEARCH ACTIVITY</div>
      </div>
      <div className={styles.contentSection}>
        <div className={styles.basedOnActivityPapers}>
          <BaseOnActivityPapers
            isLoading={isLoadingActivityPapers || props.isLoggingIn}
            papers={basedOnActivityPapers}
          />
        </div>
        <div className={styles.basedOnCollectionPapers}>
          <div className={styles.sectionTitle}>
            {basedOnCollectionPapers && (
              <Link to={`/collections/${basedOnCollectionPapers.collection.id}`} className={styles.collectionLink}>
                Go to Collection
              </Link>
            )}
            <span className={styles.sectionTitleContext}>{`Recommendation\nbased on your collection`}</span>
          </div>
          <div className={styles.sectionContent}>
            {basedOnCollectionPapers ? (
              <CollectionPapers
                collection={basedOnCollectionPapers.collection}
                papers={basedOnCollectionPapers.recommendations}
                isLoading={isLoadingCollectionPapers || props.isLoggingIn}
              />
            ) : (
              <div className={styles.noPaperContext}>you haven't added any papers to collection</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withStyles<typeof RecommendedPapers>(styles)(RecommendedPapers);
