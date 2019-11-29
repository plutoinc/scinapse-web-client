import * as React from 'react';
import classNames from 'classnames';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '../../helpers/withStylesHelper';
import { Paper } from '../../model/paper';
import { AUTH_LEVEL, blockUnverifiedUser } from '../../helpers/checkAuthDialog';
import ArticleSpinner from '../common/spinner/articleSpinner';
import { AppState } from '../../reducers';
import { getMemoizedCurrentUser } from '../../selectors/getCurrentUser';
import { CurrentUser } from '../../model/currentUser';
import { makeGetMemoizedPapers } from '../../selectors/papersSelector';
import { SimplePaperItem } from '../simplePaperItem/simplePaperItemContainer';
import { Button } from '@pluto_network/pluto-design-elements';
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
      <Button
        elementType="button"
        aria-label="Scinapse sign in button"
        onClick={openSignInDialog}
        style={{ marginTop: '24px' }}
      >
        <span>{`Sign in & View`}</span>
      </Button>
    </div>
  );
};

const RelatedPaperItem: React.FunctionComponent<{ paper: Paper }> = ({ paper }) => {
  return (
    <SimplePaperItem
      key={paper.id}
      className={styles.paperItemWrapper}
      paper={paper}
      pageType="paperShow"
      actionArea="relatedPaperList"
    />
  );
};

const RelatedPapersInPaperShow: React.FC<RelatedPapersProps> = React.memo(props => {
  const { relatedPapers, currentUser, isLoadingPapers, shouldShowRelatedPapers } = props;

  if (relatedPapers.length === 0 || !shouldShowRelatedPapers) {
    return null;
  }

  const relatedPaperItems = relatedPapers.slice(0, 3).map(paper => {
    return <RelatedPaperItem paper={paper} key={paper.id} />;
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
          <div
            className={classNames({
              [styles.relatedPaperWrapper]: !currentUser.isLoggedIn,
            })}
          >
            {relatedPaperItems}
          </div>
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
