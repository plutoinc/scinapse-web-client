import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '../../../../helpers/withStylesHelper';
import GlobalDialogManager from '../../../../helpers/globalDialogManager';
import ActionTicketManager from '../../../../helpers/actionTicketManager';
import { useObserver } from '../../../../hooks/useIntersectionHook';
import { ActionTicketParams } from '../../../../helpers/actionTicketManager/actionTicket';
import Icon from '../../../../icons';
const styles = require('./signBanner.scss');

interface SignBannerProps {
  isLoading: boolean;
}

const SignBannerSignButtonText: React.FC = () => {
  return (
    <div className={styles.bannerSignButtonWrapper}>
      <button
        onClick={() => {
          ActionTicketManager.trackTicket({
            pageType: 'searchResult',
            actionType: 'fire',
            actionArea: 'signBanner',
            actionTag: 'signUpPopup',
            actionLabel: 'signBannerAtSearch',
            expName: 'signBannerAtSearch',
          });

          GlobalDialogManager.openSignUpDialog({
            authContext: {
              pageType: 'searchResult',
              actionArea: 'signBanner',
              actionLabel: 'signBannerAtSearch',
              expName: 'signBannerAtSearch',
            },
            userActionType: 'signBannerAtSearch',
            isBlocked: false,
          });
        }}
        className={styles.bannerSignButton}
      >
        Quick example for you
      </button>
    </div>
  );
};

const SignBanner: React.FC<SignBannerProps> = props => {
  const { isLoading } = props;

  const bannerViewTicketContext: ActionTicketParams = {
    pageType: 'searchResult',
    actionType: 'view',
    actionArea: 'signBanner',
    actionTag: 'bannerView',
    actionLabel: 'signBannerAtSearch',
    expName: 'signBannerAtSearch',
  };
  const { elRef } = useObserver(0.1, bannerViewTicketContext);

  if (isLoading) {
    return (
      <div className={styles.bannerLoadingContainer}>
        <div className={styles.loadingContainer}>
          <CircularProgress size={100} thickness={2} style={{ color: '#d8dde7' }} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bannerContainer} ref={elRef}>
      <div className={styles.bannerTitle}>Make your PAPER recipe!</div>
      <div className={styles.bannerBody}>We recommend relevant papers based on your paper set. Try now!</div>
      <div className={styles.bannerImageWrapper}>
        <Icon className={styles.bannerImage} icon="RECOMMEND_SIGN_UP_BANNER" />
      </div>
      <SignBannerSignButtonText />
    </div>
  );
};

export default withStyles<typeof SignBanner>(styles)(SignBanner);
