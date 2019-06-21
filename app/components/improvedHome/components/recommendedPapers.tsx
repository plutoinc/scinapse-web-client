import * as React from 'react';
import { withStyles } from '../../../helpers/withStylesHelper';
import homeAPI, { BasedOnCollectionPapersParams } from '../../../api/home';
import { Paper } from '../../../model/paper';
import BaseOnActivityPapers from './BaseOnActivityPapers';
import BaseOnCollectionPapers from './BaseOnCollectionPapers';
const styles = require('./recommendedPapers.scss');

const RecommendedPapers: React.FC<{ isLoggedIn: boolean; isLoggingIn: boolean }> = ({ isLoggedIn, isLoggingIn }) => {
  const [isLoadingActivityPapers, setIsLoadingActivityPapers] = React.useState(false);
  const [isLoadingCollectionPapers, setIsLoadingCollectionPapers] = React.useState(false);

  const [basedOnCollectionPapers, setBasedOnCollectionPapers] = React.useState<BasedOnCollectionPapersParams>();
  const [basedOnActivityPapers, setBasedOnActivityPapers] = React.useState<Paper[]>([]);

  React.useEffect(
    () => {
      if (isLoggedIn) {
        setIsLoadingActivityPapers(true);
        setIsLoadingCollectionPapers(true);

        homeAPI
          .getBasedOnActivityPapers()
          .then(res => {
            setBasedOnActivityPapers(res);
            setIsLoadingActivityPapers(false);
          })
          .catch(err => {
            console.error(err);
            setIsLoadingActivityPapers(false);
          });

        homeAPI
          .getBasedOnCollectionPapers()
          .then(res => {
            setBasedOnCollectionPapers(res);
            setIsLoadingCollectionPapers(false);
          })
          .catch(err => {
            console.error(err);
            setIsLoadingCollectionPapers(false);
          });
      }
    },
    [isLoggedIn]
  );

  if (!isLoggedIn) return null;

  return (
    <div className={styles.recommendedPapersContainer}>
      <div className={styles.titleSection}>
        <div className={styles.title}>Recommended papers based on your activity</div>
        <div className={styles.subTitle}>BASED ON YOUR SEARCH ACTIVITY</div>
      </div>
      <div className={styles.contentSection}>
        <div className={styles.basedOnActivityPapers}>
          <BaseOnActivityPapers isLoading={isLoadingActivityPapers || isLoggingIn} papers={basedOnActivityPapers} />
        </div>
        <div className={styles.basedOnCollectionPapers}>
          <BaseOnCollectionPapers
            basedOnCollectionPapers={basedOnCollectionPapers!}
            isLoading={isLoadingCollectionPapers || isLoggingIn}
          />
        </div>
      </div>
    </div>
  );
};

export default withStyles<typeof RecommendedPapers>(styles)(RecommendedPapers);
