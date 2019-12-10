import * as React from 'react';
import { Button } from '@pluto_network/pluto-design-elements';
import { withStyles } from '../../../../helpers/withStylesHelper';
import ArticleSpinner from '../../../common/spinner/articleSpinner';
import Icon from '../../../../icons';
import ActionTicketManager from '../../../../helpers/actionTicketManager';
import { AUTH_LEVEL, blockUnverifiedUser } from '../../../../helpers/checkAuthDialog';
const styles = require('./doiSearchBlocked.scss');

interface DoiSearchBlockedProps {
  searchDoi: string;
  isLoading: boolean;
}

async function openSignInDialog() {
  await blockUnverifiedUser({
    authLevel: AUTH_LEVEL.VERIFIED,
    actionArea: 'searchResult',
    actionLabel: 'doiSearch',
    userActionType: 'doiSearch',
  });
}

const DoiSearchBlocked: React.FunctionComponent<DoiSearchBlockedProps> = props => {
  const { isLoading, searchDoi } = props;

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <ArticleSpinner className={styles.loadingSpinner} />
      </div>
    );
  }

  ActionTicketManager.trackTicket({
    pageType: 'searchResult',
    actionType: 'view',
    actionArea: 'searchResult',
    actionTag: 'pageView',
    actionLabel: 'doiSearch',
    expName: 'doiSearch',
  });

  return (
    <div className={styles.articleSearchContainer}>
      <div className={styles.innerContainer}>
        <div className={styles.doiBlockedContainer}>
          <div className={styles.iconWrapper}>
            <Icon icon="MATCHED_PAPER" />
          </div>
          <div className={styles.doiBlockedContentWrapper}>
            <div className={styles.doiBlockedTitle}>DOI Match!</div>
            <div className={styles.doiBlockedContent}>
              <span>
                <b className={styles.keyword}>We found a paper</b> that seem to match DOI{' '}
                <b className={styles.keyword}>"{searchDoi}"</b>
              </span>
              <br />
              <span>
                Please{' '}
                <b className={styles.signInLink} onClick={openSignInDialog}>
                  sign in
                </b>{' '}
                to view the result.
              </span>
              <br />
              <Button
                elementType="button"
                aria-label="Scinapse sign in button"
                onClick={openSignInDialog}
                style={{ marginTop: '16px' }}
              >
                <span>Sign in and View the result</span>
                <Icon icon="ARROW_RIGHT" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withStyles<typeof DoiSearchBlocked>(styles)(DoiSearchBlocked);
