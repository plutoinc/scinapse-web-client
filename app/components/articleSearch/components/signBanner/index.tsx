import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '../../../../helpers/withStylesHelper';
import GlobalDialogManager from '../../../../helpers/globalDialogManager';
import ActionTicketManager from '../../../../helpers/actionTicketManager';
import { useObserver } from '../../../../hooks/useIntersectionHook';
import { ActionTicketParams } from '../../../../helpers/actionTicketManager/actionTicket';
const styles = require('./signBanner.scss');

interface SignBannerProps {
  isLoading: boolean;
}

const SignBannerSignButtonText: React.FC = React.memo(() => {
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
        Join Now
      </button>
    </div>
  );
});

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
      <div className={styles.bannerTitle}>Be a Scinapse Member</div>
      <div className={styles.bannerBody}>Become a Scinapse member. Members can use all features unlimitedly.</div>
      <div className={styles.bannerImageWrapper}>
        <picture>
          <source srcSet={'https://assets.pluto.network/signup_modal/researchers.webp'} type="image/webp" />
          <source srcSet={'https://assets.pluto.network/signup_modal/researchers.jpg'} type="image/jpeg" />
          <img
            className={styles.bannerImage}
            src={'https://assets.pluto.network/signup_modal/researchers.jpg'}
            alt={'bannerImage'}
          />
        </picture>
      </div>
      <SignBannerSignButtonText />
    </div>
  );
};

export default withStyles<typeof SignBanner>(styles)(SignBanner);
