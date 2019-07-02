import * as React from 'react';
import { blockUnverifiedUser, AUTH_LEVEL } from '../../../helpers/checkAuthDialog';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import SearchingPDFBtn from '../../../components/paperShow/components/searchingPDFBtn';
import { CurrentUser } from '../../../model/currentUser';
import { addBasedOnRecommendationActivity } from '../../../helpers/addBasedOnRecommendationActivity';
const s = require('../actionBar.scss');

const RequestFullTextBtn: React.FunctionComponent<{
  isLoading: boolean;
  paperId: number;
  currentUser: CurrentUser;
  handleSetIsOpen: (value: React.SetStateAction<boolean>) => void;
  actionArea: Scinapse.ActionTicket.ActionArea;
  btnStyle?: React.CSSProperties;
}> = React.memo(props => {
  const { isLoading, paperId, handleSetIsOpen, btnStyle, currentUser } = props;

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

        const isBlocked = await blockUnverifiedUser({
          authLevel: AUTH_LEVEL.VERIFIED,
          actionArea: props.actionArea,
          actionLabel: 'clickRequestFullTextBtn',
          userActionType: 'clickRequestFullTextBtn',
        });

        if (!isBlocked) {
          handleSetIsOpen(true);
          addBasedOnRecommendationActivity(currentUser.isLoggedIn, paperId);
        }
      }}
      className={s.fullTextBtn}
    >
      <Icon icon="SEND" className={s.sendIcon} />
      Request Full-text
    </button>
  );
});

export default withStyles<typeof RequestFullTextBtn>(s)(RequestFullTextBtn);
