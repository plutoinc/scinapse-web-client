import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '../../helpers/withStylesHelper';
import { Paper } from '../../model/paper';
import PaperItem from '../common/paperItem/paperItem';
import { AUTH_LEVEL, blockUnverifiedUser } from '../../helpers/checkAuthDialog';
import ArticleSpinner from '../common/spinner/articleSpinner';
import { AppState } from '../../reducers';
import { getMemoizedCurrentUser } from '../../selectors/getCurrentUser';
import { CurrentUser } from '../../model/currentUser';
import { makeGetMemoizedPapers } from '../../selectors/papersSelector';
const styles = require('./relatedPapers.scss');

interface RelatedPapersProps {
  dispatch: Dispatch<any>;
  currentUser: CurrentUser;
  isLoadingPapers: boolean;
  relatedPapers: Paper[];
  shouldShowRelatedPapers?: boolean;
}

async function openSignInDialog() {
  await blockUnverifiedUser({
    authLevel: AUTH_LEVEL.VERIFIED,
    actionArea: 'paperShow',
    actionLabel: 'relatedPaperAtPaperShow',
    userActionType: 'relatedPaperAtPaperShow',
  });
}

const ContentBlocker: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  if (isLoggedIn) {
    return null;
  }

  return (
    <div className={styles.contentBlockedContainer}>
      <div className={styles.contentBlockedContext}>
        {`78% of Scinapse members use related papers.\nAfter signing in, all features are free.`}
      </div>
      <button className={styles.signInBtn} onClick={openSignInDialog}>
        Sign in & View
      </button>
    </div>
  );
};

const RelatedPaperItem: React.FunctionComponent<{ paper: Paper }> = ({ paper }) => {
  return (
    <div key={paper.id} className={styles.paperItemWrapper}>
      <PaperItem paper={paper} pageType="paperShow" actionArea="relatedPaperList" omitAbstract />
    </div>
  );
};

const RelatedPapersInPaperShow: React.FC<RelatedPapersProps> = React.memo(props => {
  const { relatedPapers, currentUser, isLoadingPapers, shouldShowRelatedPapers } = props;

  if (relatedPapers.length === 0 || !shouldShowRelatedPapers) {
    return null;
  }

  const relatedPaperItems = relatedPapers.map((paper, index) => {
    if (index < 3) {
      return (
        <div key={paper.id}>
          <RelatedPaperItem paper={paper} />
        </div>
      );
    }
  });

  return (
    <div className={styles.relatedPaperContainer}>
      <div className={styles.titleContext}>📖 Papers frequently viewed together</div>
      {isLoadingPapers ? (
        <div className={styles.loadingContainer}>
          <ArticleSpinner className={styles.loadingSpinner} />
        </div>
      ) : (
        <>
          <div className={!currentUser.isLoggedIn ? styles.relatedPaperWrapper : undefined}>{relatedPaperItems}</div>
          <ContentBlocker isLoggedIn={currentUser.isLoggedIn} />
        </>
      )}
    </div>
  );
});

function makeMapStateToProps() {
  return (state: AppState) => {
    const getMemoizedRelatedPapers = makeGetMemoizedPapers(() => {
      return state.relatedPapersState.paperIds;
    });
    return {
      currentUser: getMemoizedCurrentUser(state),
      isLoadingPapers: state.relatedPapersState.isLoading,
      relatedPapers: getMemoizedRelatedPapers(state),
    };
  };
}

export default connect(makeMapStateToProps)(
  withStyles<typeof RelatedPapersInPaperShow>(styles)(RelatedPapersInPaperShow)
);
