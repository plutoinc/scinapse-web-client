import * as React from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
import GlobalDialogManager from '../../helpers/globalDialogManager';
import { ActionTicketParams } from '../../helpers/actionTicketManager/actionTicket';
import { useObserver } from '../../hooks/useIntersectionHook';
import ActionTicketManager from '../../helpers/actionTicketManager';
const styles = require('./bottomBanner.scss');

interface BottomBannerProps {
  isLoggedIn: boolean;
  shouldShowBottomBanner: boolean;
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

const BottomBanner: React.FC<BottomBannerProps> = ({ isLoggedIn, shouldShowBottomBanner }) => {
  const bannerViewTicketContext: ActionTicketParams = {
    pageType: 'paperShow',
    actionType: 'view',
    actionArea: 'signBanner',
    actionTag: 'bannerView',
    actionLabel: 'bottomBanner',
  };
  const { elRef } = useObserver(0.1, bannerViewTicketContext);

  if (isLoggedIn || !shouldShowBottomBanner) {
    return null;
  }

  return (
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
  );
};

export default withStyles<typeof styles>(styles)(BottomBanner);
