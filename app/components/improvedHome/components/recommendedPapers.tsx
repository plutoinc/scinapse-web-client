import * as React from 'react';
import { withStyles } from '../../../helpers/withStylesHelper';
import BaseOnActivityPaperList from './BasedOnActivityPaperList';
import BaseOnCollectionPaperList from './BasedOnCollectionPaperList';
import { Paper } from '../../../model/paper';
import { BasedOnCollectionPapersParams } from '../../../api/home';
const styles = require('./recommendedPapers.scss');

interface RecommendedPapersProps {
  shouldShow: boolean;
  isLoggingIn: boolean;
  isLoadingActivityPapers: boolean;
  isLoadingCollectionPapers: boolean;
  basedOnActivityPapers: Paper[];
  basedOnCollectionPapers: BasedOnCollectionPapersParams | undefined;
}

const RecommendedPapers: React.FC<RecommendedPapersProps> = props => {
  const {
    isLoadingActivityPapers,
    isLoadingCollectionPapers,
    basedOnActivityPapers,
    basedOnCollectionPapers,
    shouldShow,
    isLoggingIn,
  } = props;

  if (!shouldShow) return null;

  return (
    <>
      <div className={styles.contentBlockDivider} />
      <div className={styles.recommendedPapersContainer}>
        <div className={styles.titleSection}>
          <div className={styles.title}>Recommended papers for you</div>
          <div className={styles.subTitle}>BASED ON YOUR SEARCH ACTIVITY</div>
        </div>
        <div className={styles.contentSection}>
          <div className={styles.basedOnActivityPapers}>
            <BaseOnActivityPaperList
              isLoading={isLoadingActivityPapers || isLoggingIn}
              papers={basedOnActivityPapers}
            />
          </div>
          <div className={styles.basedOnCollectionPapers}>
            <BaseOnCollectionPaperList
              basedOnCollectionPapers={basedOnCollectionPapers!}
              isLoading={isLoadingCollectionPapers || isLoggingIn}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default withStyles<typeof RecommendedPapers>(styles)(RecommendedPapers);
