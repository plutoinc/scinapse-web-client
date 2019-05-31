import * as React from 'react';
import { blockUnverifiedUser, AUTH_LEVEL } from '../../../helpers/checkAuthDialog';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import SearchingPDFBtn from '../../../components/paperShow/components/searchingPDFBtn';
import { getUserGroupName } from '../../../helpers/abTestHelper/index';
import { SIGN_BUBBLE_TEST } from '../../../constants/abTestGlobalValue';
import { setBubbleContextTypeHelper } from '../../../helpers/getBubbleContextType';
import LockedLabel from '../../../components/preNoted/lockedLabel';
import { CurrentUser } from '../../../model/currentUser';
const s = require('../actionBar.scss');

const RequestFullTextBtn: React.FunctionComponent<{
  isLoading: boolean;
  paperId: number;
  currentUser: CurrentUser;
  isOpenBlockedPopper?: boolean;
  handleSetIsOpen: (value: React.SetStateAction<boolean>) => void;
  handleSetIsOpenBlockedPopper: (value: React.SetStateAction<boolean>) => void;
  actionArea: Scinapse.ActionTicket.ActionArea;
  btnStyle?: React.CSSProperties;
}> = React.memo(props => {
  const { isLoading, paperId, isOpenBlockedPopper, handleSetIsOpen, btnStyle, handleSetIsOpenBlockedPopper } = props;

  React.useEffect(
    () => {
      if (props.currentUser.isLoggedIn) {
        props.handleSetIsOpenBlockedPopper(false);
      }
    },
    [props.currentUser]
  );

  if (isLoading) {
    return <SearchingPDFBtn isLoading={isLoading} />;
  }

  return (
    <button
      style={!!btnStyle ? btnStyle : {}}
      onClick={async () => {
        ActionTicketManager.trackTicket({
          pageType: 'paperShow',
          actionType: 'fire',
          actionArea: props.actionArea,
          actionTag: 'clickRequestFullTextBtn',
          actionLabel: String(paperId),
        });

        if (!props.currentUser.isLoggedIn && getUserGroupName(SIGN_BUBBLE_TEST) === 'bubble') {
          handleSetIsOpenBlockedPopper(!isOpenBlockedPopper);

          if (!isOpenBlockedPopper) {
            return setBubbleContextTypeHelper();
          }
          return;
        }

        const isBlocked = await blockUnverifiedUser({
          authLevel: AUTH_LEVEL.VERIFIED,
          actionArea: props.actionArea,
          actionLabel: 'clickRequestFullTextBtn',
          userActionType: 'clickRequestFullTextBtn',
        });

        if (!isBlocked) {
          handleSetIsOpen(true);
        }
      }}
      className={s.fullTextBtn}
    >
      <Icon icon="SEND" className={s.sendIcon} />
      Request Full-text
      <LockedLabel />
    </button>
  );
});

export default withStyles<typeof RequestFullTextBtn>(s)(RequestFullTextBtn);
