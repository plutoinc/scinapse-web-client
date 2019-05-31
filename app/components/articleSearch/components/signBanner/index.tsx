import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '../../../../helpers/withStylesHelper';
import {
  SIGN_BANNER_AT_SEARCH_BANNER_TEST,
  SIGN_BANNER_AT_SEARCH_CURATED_TEST,
} from '../../../../constants/abTestGlobalValue';
import { getUserGroupName } from '../../../../helpers/abTestHelper';
import GlobalDialogManager from '../../../../helpers/globalDialogManager';
import ActionTicketManager from '../../../../helpers/actionTicketManager';
import { useObserver } from '../../../../hooks/useIntersectionHook';
import { ActionTicketParams } from '../../../../helpers/actionTicketManager/actionTicket';
const styles = require('./signBanner.scss');

interface SignBannerProps {
  isLoading: boolean;
}

interface SignBannerContextObj {
  titleText: string;
  buttonText: string;
}

const SignBannerSignButtonText: React.FunctionComponent<{ buttonText: string }> = React.memo(props => {
  const { buttonText } = props;

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
        {buttonText}
      </button>
    </div>
  );
});

function getSignBannerContext(): SignBannerContextObj {
  const signBannerCuratedUserGroupName: string = getUserGroupName(SIGN_BANNER_AT_SEARCH_CURATED_TEST) || '';

  switch (signBannerCuratedUserGroupName) {
    case 'areyouresearcher-yesofcourse':
      return { titleText: 'Are you a researcher?', buttonText: 'Yes, of course' };
    case 'bemember-joinnow':
      return { titleText: 'Be a Scinapse Member', buttonText: 'Join Now' };
    case 'areyouresearcher-signup':
      return { titleText: 'Are you a researcher?', buttonText: 'Sign Up' };
  }

  return { titleText: '', buttonText: '' };
}

const SignBanner: React.FunctionComponent<SignBannerProps> = props => {
  const { isLoading } = props;

  const signBannerUserGroupName: string = getUserGroupName(SIGN_BANNER_AT_SEARCH_BANNER_TEST) || '';
  const signBannerContext: SignBannerContextObj = getSignBannerContext();
  const bannerViewTicketContext: ActionTicketParams = {
    pageType: 'searchResult',
    actionType: 'view',
    actionArea: 'signBanner',
    actionTag: 'bannerView',
    actionLabel: 'signBannerAtSearch',
    expName: 'signBannerAtSearch',
  };
  const { elRef } = useObserver(0.1, bannerViewTicketContext);
  const isBannerShow = signBannerUserGroupName === 'banner';

  if (!isBannerShow) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={styles.bannerContainer}>
        <div className={styles.loadingContainer}>
          <CircularProgress size={100} thickness={2} style={{ color: '#d8dde7' }} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bannerContainer} ref={elRef}>
      <div className={styles.bannerTitle}>{signBannerContext.titleText}</div>
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
      <SignBannerSignButtonText buttonText={signBannerContext.buttonText} />
    </div>
  );
};

export default withStyles<typeof styles>(styles)(SignBanner);
