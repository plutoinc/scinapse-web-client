import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '../../../helpers/withStylesHelper';
import BaseOnActivityPaperList from './BasedOnActivityPaperList';
import BaseOnCollectionPaperList from './BasedOnCollectionPaperList';
import { AppState } from '../../../reducers';
const styles = require('./recommendedPapers.scss');

type Props = ReturnType<typeof mapStateToProps> & {
  shouldShow: boolean;
  isLoggingIn: boolean;
};

const RecommendedPapers: React.FC<Props> = props => {
  const { recommendedPapers, shouldShow, isLoggingIn } = props;
  const {
    isLoadingActivityPapers,
    isLoadingCollectionPapers,
    basedOnActivityPapers,
    basedOnCollectionPapers,
  } = recommendedPapers;

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

function mapStateToProps(state: AppState) {
  return {
    recommendedPapers: state.recommendedPapersState,
  };
}

export default connect(mapStateToProps)(withStyles<typeof RecommendedPapers>(styles)(RecommendedPapers));
