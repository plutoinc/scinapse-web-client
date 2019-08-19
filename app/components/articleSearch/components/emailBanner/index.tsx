import React from 'react';
import { withStyles } from '../../../../helpers/withStylesHelper';
import { setSignUpModalEmail } from '../../../../reducers/signUpModal';
import { useDispatch } from 'react-redux';
import ActionTicketManager from '../../../../helpers/actionTicketManager';
import { getCurrentPageType } from '../../../locationListener';
import GlobalDialogManager from '../../../../helpers/globalDialogManager';
const s = require('./emailBanner.scss');

const EmailBanner: React.FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = React.useState('');
  return (
    <div className={s.wrapper}>
      <div className={s.title}>Get recommendation letters</div>
      <div className={s.subtitle}>Stay connected with relevant researches.</div>
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
