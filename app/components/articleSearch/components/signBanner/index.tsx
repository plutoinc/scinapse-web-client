import * as React from 'react';
import { withStyles } from '../../../../helpers/withStylesHelper';
import GlobalDialogManager from '../../../../helpers/globalDialogManager';
import ActionTicketManager from '../../../../helpers/actionTicketManager';
import { useObserver } from '../../../../hooks/useIntersectionHook';
import { ActionTicketParams } from '../../../../helpers/actionTicketManager/actionTicket';
const styles = require('./signBanner.scss');

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

const SignBanner: React.FC = () => {
  const bannerViewTicketContext: ActionTicketParams = {
    pageType: 'searchResult',
    actionType: 'view',
    actionArea: 'signBanner',
    actionTag: 'bannerView',
    actionLabel: 'signBannerAtSearch',
    expName: 'signBannerAtSearch',
  };
  const { elRef } = useObserver(0.8, bannerViewTicketContext);

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
