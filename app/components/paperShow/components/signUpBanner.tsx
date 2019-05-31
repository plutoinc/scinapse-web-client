import * as React from 'react';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { withStyles } from '../../../helpers/withStylesHelper';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import { ActionTicketParams } from '../../../helpers/actionTicketManager/actionTicket';
import { useObserver } from '../../../hooks/useIntersectionHook';
import Icon from '../../../icons';
const styles = require('./signUpBanner.scss');

interface SignBannerProps {
  shouldShowSignBanner: boolean;
}

const OpenSignUpModalBtn: React.FunctionComponent<{}> = React.memo(() => {
  return (
    <div className={styles.bannerSignButtonWrapper}>
      <button
        onClick={() => {
          ActionTicketManager.trackTicket({
            pageType: 'searchResult',
            actionType: 'fire',
            actionArea: 'signBanner',
            actionTag: 'signUpPopup',
            actionLabel: 'signBannerAtPaperShow',
            expName: 'signBannerAtPaperShow',
          });

          GlobalDialogManager.openSignUpDialog({
            authContext: {
              pageType: 'paperShow',
              actionArea: 'signBanner',
              actionLabel: 'signBannerAtPaperShow',
              expName: 'signBannerAtPaperShow',
            },
            userActionType: 'signBannerAtPaperShow',
            isBlocked: false,
          });
        }}
        className={styles.bannerSignButton}
      >
        <Icon icon="UNLOCK" className={styles.bannerSignBtnIcon} />
        Sign Up
      </button>
    </div>
  );
});

const SignUpBanner: React.FunctionComponent<SignBannerProps> = props => {
  const { shouldShowSignBanner } = props;

  const bannerViewTicketContext: ActionTicketParams = {
    pageType: 'paperShow',
    actionType: 'view',
    actionArea: 'signBanner',
    actionTag: 'bannerView',
    actionLabel: 'signBannerAtPaperShow',
    expName: 'signBannerAtPaperShow',
  };

  const { elRef } = useObserver(0.1, bannerViewTicketContext);

  if (!shouldShowSignBanner) {
    return null;
  }

  return (
    <div className={styles.bannerContainer} ref={elRef}>
      <div className={styles.bannerIconWrapper}>
        <Icon icon="UNLOCK" />
      </div>
      <div className={styles.bannerTitle}>{`Sign Up\nand Unlock`}</div>
      <OpenSignUpModalBtn />
    </div>
  );
};

export default withStyles<typeof styles>(styles)(SignUpBanner);
