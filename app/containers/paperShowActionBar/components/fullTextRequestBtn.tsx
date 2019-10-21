import * as React from 'react';
import { useDispatch } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import { blockUnverifiedUser, AUTH_LEVEL } from '../../../helpers/checkAuthDialog';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import SearchingPDFBtn from '../../../components/paperShow/components/searchingPDFBtn';
import { addPaperToRecommendPool } from '../../../components/recommendPool/actions';
import { useFullTextExpHook } from '../../../hooks/fulltextExpHook';
import { FullTextExperimentType } from '../../../constants/abTestObject';
import CollectionButton from '../../../components/common/paperItem/collectionButton';
import { Paper } from '../../../model/paper';
const s = require('../actionBar.scss');

interface RequestFullTextBtnProps {
  isLoading: boolean;
  paper: Paper;
  onClick: () => void;
  actionArea: Scinapse.ActionTicket.ActionArea;
  btnStyle?: React.CSSProperties;
  lastRequestedDate: string | null;
}

const RequestFullTextBtn: React.FC<RequestFullTextBtnProps> = React.memo(props => {
  const dispatch = useDispatch();
  const { isLoading, paper, actionArea, onClick, btnStyle, lastRequestedDate } = props;
  const fullTextUserGroup = useFullTextExpHook();

  if (isLoading) {
    return <SearchingPDFBtn isLoading={isLoading} />;
  }

  if (fullTextUserGroup === FullTextExperimentType.REMOVE) {
    return (
      <CollectionButton
        pageType="paperShow"
        actionArea={actionArea}
        paper={paper}
        saved={!!paper.relation && paper.relation.savedInCollections.length > 0}
        buttonStyle={{ height: '40px', background: '#3e7fff', border: 0, fontWeight: 500 }}
      />
    );
  }

  return (
    <Tooltip
      disableHoverListener={lastRequestedDate && lastRequestedDate.length > 0 ? false : true}
      disableFocusListener={true}
      disableTouchListener={true}
      title={`You sent the request on ${lastRequestedDate}.`}
      placement="top"
      classes={{ tooltip: s.arrowBottomTooltip }}
    >
      <button
        style={!!btnStyle ? btnStyle : {}}
        onClick={async () => {
          ActionTicketManager.trackTicket({
            pageType: 'paperShow',
            actionType: 'fire',
            actionArea,
            actionTag: 'clickRequestFullTextBtn',
            actionLabel: String(paper.id),
          });

          dispatch(addPaperToRecommendPool({ paperId: paper.id, action: 'clickRequestFullTextBtn' }));

          const isBlocked = await blockUnverifiedUser({
            authLevel: AUTH_LEVEL.VERIFIED,
            actionArea,
            actionLabel: 'clickRequestFullTextBtn',
            userActionType: 'clickRequestFullTextBtn',
          });

          if (!isBlocked) {
            onClick();
          }
        }}
        className={s.fullTextBtn}
      >
        <Icon icon="SEND" className={s.sendIcon} />
        Request Full-text
      </button>
    </Tooltip>
  );
});

export default withStyles<typeof RequestFullTextBtn>(s)(RequestFullTextBtn);
