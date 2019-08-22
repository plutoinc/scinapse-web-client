import React from 'react';
import { withStyles } from '../../../../helpers/withStylesHelper';
import { setSignUpModalEmail } from '../../../../reducers/signUpModal';
import { useDispatch } from 'react-redux';
import ActionTicketManager from '../../../../helpers/actionTicketManager';
import { getCurrentPageType } from '../../../locationListener';
import GlobalDialogManager from '../../../../helpers/globalDialogManager';
import { getUserGroupName } from '../../../../helpers/abTestHelper';
import { EMAIL_RECOMMEND_PAPER_SIGN_UP_BANNER } from '../../../../constants/abTestGlobalValue';
import { EmailRecommendPaperSignUpBannerTestType } from '../../../../constants/abTestObject';

const s = require('./emailBanner.scss');

const EmailBanner: React.FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = React.useState('');
  const [testType, setTestType] = React.useState<EmailRecommendPaperSignUpBannerTestType | null>(null);

  React.useEffect(() => {
    const userGroup = getUserGroupName(EMAIL_RECOMMEND_PAPER_SIGN_UP_BANNER) as EmailRecommendPaperSignUpBannerTestType;
    if (
      userGroup !== EmailRecommendPaperSignUpBannerTestType.RECOMMEND &&
      userGroup !== EmailRecommendPaperSignUpBannerTestType.TIRED &&
      userGroup !== EmailRecommendPaperSignUpBannerTestType.WONDER
    ) {
      return;
    }

    setTestType(userGroup);
  }, []);

  if (!testType) return null;

  let title;
  let subtitle;
  switch (testType) {
    case EmailRecommendPaperSignUpBannerTestType.RECOMMEND: {
      title = 'Get recommendation letters';
      subtitle = 'Stay connected with relevant researches.';
      break;
    }

    case EmailRecommendPaperSignUpBannerTestType.TIRED: {
      title = 'Tired of searching papers?';
      subtitle = 'Get recommendations based on your activity.';
      break;
    }

    case EmailRecommendPaperSignUpBannerTestType.WONDER: {
      title = 'Are you wondering?';
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
              actionLabel: null,
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