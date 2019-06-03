import * as React from 'react';
import NoSsr from '@material-ui/core/NoSsr';
import { withStyles } from '../../helpers/withStylesHelper';
import GlobalDialogManager from '../../helpers/globalDialogManager';
import { ActionTicketParams } from '../../helpers/actionTicketManager/actionTicket';
import { useObserver } from '../../hooks/useIntersectionHook';
import ActionTicketManager from '../../helpers/actionTicketManager';
import { getUserGroupName } from '../../helpers/abTestHelper';
import { SIGN_BANNER_AT_PAPER_SHOW_TEST } from '../../constants/abTestGlobalValue';
import { CurrentUser } from '../../model/currentUser';
const styles = require('./bottomBanner.scss');

interface BottomBannerProps {
  currentUser: CurrentUser;
}

function handleOpenSignModal(modalType: 'signUpPopup' | 'signInPopup') {
  switch (modalType) {
    case 'signInPopup':
      GlobalDialogManager.openSignInDialog({
        authContext: {
          pageType: 'paperShow',
          actionArea: 'signBanner',
          actionLabel: 'bottomBanner',
        },
        isBlocked: false,
      });

      break;
    case 'signUpPopup':
      GlobalDialogManager.openSignUpDialog({
        authContext: {
          pageType: 'paperShow',
          actionArea: 'signBanner',
          actionLabel: 'bottomBanner',
        },
        isBlocked: false,
      });

      break;
  }

  ActionTicketManager.trackTicket({
    pageType: 'paperShow',
    actionType: 'fire',
    actionArea: 'signBanner',
    actionLabel: 'bottomBanner',
    actionTag: modalType,
  });
}

const BottomBanner: React.FC<BottomBannerProps> = ({ currentUser }) => {
  const [shouldShow, setShouldShow] = React.useState(false);

  React.useEffect(
    () => {
      setShouldShow(
        getUserGroupName(SIGN_BANNER_AT_PAPER_SHOW_TEST) === 'bottomBanner' &&
          !currentUser.isLoggedIn &&
          !currentUser.isLoggingIn
      );
    },
    [currentUser]
  );

  const bannerViewTicketContext: ActionTicketParams = {
    pageType: 'paperShow',
    actionType: 'view',
    actionArea: 'signBanner',
    actionTag: 'bannerView',
    actionLabel: 'bottomBanner',
  };
  const { elRef } = useObserver(0.1, bannerViewTicketContext);

  if (!shouldShow) {
    return null;
  }

  return (
    <NoSsr>
      <div className={styles.bannerContainer} ref={elRef}>
        <div className={styles.bannerWrapper}>
          <div className={styles.contextWrapper}>
            <div className={styles.titleContext}>PREVIEW OF SCINAPSE</div>
            <div className={styles.mainContext}>
              Sign up to get unlimited search results and full-texts. It's free and always will be.
            </div>
          </div>
          <div className={styles.buttonWrapper}>
            <button className={styles.subContext} onClick={() => handleOpenSignModal('signInPopup')}>
              Already have an account?
            </button>
            <button className={styles.signUpBtn} onClick={() => handleOpenSignModal('signUpPopup')}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </NoSsr>
  );
};

export default withStyles<typeof styles>(styles)(BottomBanner);
