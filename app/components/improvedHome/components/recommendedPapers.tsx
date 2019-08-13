import * as React from 'react';
import { withStyles } from '../../../helpers/withStylesHelper';
import BaseOnActivityPaperList from './basedOnActivityPaperList';
import BaseOnCollectionPaperList from './basedOnCollectionPaperList';
import { Paper } from '../../../model/paper';
import { BasedOnCollectionPapersParams } from '../../../api/recommendation';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import EnvChecker from '../../../helpers/envChecker';
import Icon from '../../../icons';
const styles = require('./recommendedPapers.scss');
const NAVBAR_HEIGHT = 64;

interface RecommendedPapersProps {
  shouldShow: boolean;
  isLoggingIn: boolean;
  isLoadingActivityPapers: boolean;
  isLoadingCollectionPapers: boolean;
  basedOnActivityPapers: Paper[];
  basedOnCollectionPapers: BasedOnCollectionPapersParams | undefined;
  handleGetBasedOnActivityPapers: () => void;
}
type Props = RouteComponentProps<any> & RecommendedPapersProps;

const RecommendedPapers: React.FC<Props> = props => {
  const {
    isLoadingActivityPapers,
    isLoadingCollectionPapers,
    basedOnActivityPapers,
    basedOnCollectionPapers,
    handleGetBasedOnActivityPapers,
    shouldShow,
    isLoggingIn,
    location,
  } = props;
  const recommendedEl = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(
    () => {
      let target: HTMLDivElement | null = null;
      if (location.hash === '#recommended' && shouldShow) {
        target = recommendedEl.current;
      }
      if (!EnvChecker.isOnServer() && target) {
        window.scrollTo(0, target.offsetTop - NAVBAR_HEIGHT);
      }
    },
    [shouldShow, location]
  );

  if (!shouldShow) return null;

  return (
    <>
      <div className={styles.contentBlockDivider} ref={recommendedEl} />
      <div className={styles.recommendedPapersContainer}>
        <div className={styles.titleSection}>
          <div className={styles.title}>Recommended papers for you</div>
          <div className={styles.subTitle}>
            BASED ON YOUR SEARCH ACTIVITY
            <div className={styles.refreshButton} onClick={handleGetBasedOnActivityPapers}>
              <Icon className={styles.refreshIcon} icon="RELOAD" />REFRESH
            </div>
          </div>
        </div>
        <div className={styles.contentSection}>
          <div className={styles.basedOnActivityPapers}>
            <BaseOnActivityPaperList
              isLoading={isLoadingActivityPapers || isLoggingIn}
              papers={basedOnActivityPapers}
              refreshBasedOnActivityPapers={handleGetBasedOnActivityPapers}
            />
          </div>
          <div className={styles.basedOnCollectionPapers}>
            <BaseOnCollectionPaperList
              basedOnCollectionPapers={basedOnCollectionPapers}
              isLoading={isLoadingCollectionPapers || isLoggingIn}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(withStyles<typeof RecommendedPapers>(styles)(RecommendedPapers));
