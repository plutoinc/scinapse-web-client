import React from 'react';
import { withStyles } from '../../../../helpers/withStylesHelper';
import { setSignUpModalEmail } from '../../../../reducers/signUpModal';
import { useDispatch } from 'react-redux';
import ActionTicketManager from '../../../../helpers/actionTicketManager';
import { getCurrentPageType } from '../../../locationListener';
import GlobalDialogManager from '../../../../helpers/globalDialogManager';
import { EmailRecommendPaperSignUpBannerTestType } from '../../../../constants/abTestObject';

const s = require('./emailBanner.scss');

const EmailBanner: React.FC<{ testType: EmailRecommendPaperSignUpBannerTestType }> = ({ testType }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = React.useState('');

  let title;
  let subtitle;
  switch (testType) {
    case EmailRecommendPaperSignUpBannerTestType.LETTERS: {
      title = 'Get recommendation letters';
      subtitle = 'Stay connected with relevant researches.';
      break;
    }

    case EmailRecommendPaperSignUpBannerTestType.TIRED: {
      title = 'Tired of searching papers?';
      subtitle = 'Get recommendations based on your activity.';
      break;
    }

    case EmailRecommendPaperSignUpBannerTestType.WANDERING: {
      title = 'Are you wandering?';
      subtitle = 'Get recommendations based on your activity.';
      break;
    }
  }

  return (
    <div className={s.wrapper}>
      <div className={s.title}>{title}</div>
      <div className={s.subtitle}>{subtitle}</div>
      <form
        onSubmit={e => {
          e.preventDefault();
          dispatch(setSignUpModalEmail({ email }));
          ActionTicketManager.trackTicket({
            pageType: getCurrentPageType(),
            actionType: 'fire',
            actionArea: 'recommendEmailBanner',
            actionTag: 'signUpPopup',
            actionLabel: 'recommendEmailBanner',
          });
          GlobalDialogManager.openSignUpDialog({
            authContext: {
              pageType: getCurrentPageType(),
              actionArea: 'recommendEmailBanner',
              actionLabel: 'recommendEmailBanner',
            },
            userActionType: 'recommendEmailBanner',
            isBlocked: false,
          });
        }}
        className={s.inputWrapper}
      >
        <input
          type="email"
          placeholder="Your email address"
          className={s.emailInput}
          value={email}
          onChange={e => setEmail(e.currentTarget.value)}
          size={15}
        />
        <button type="submit" className={s.signUpBtn}>
          Sign up
        </button>
      </form>
    </div>
  );
};

export default withStyles<typeof EmailBanner>(s)(EmailBanner);
