import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import classNames from 'classnames';
import { withStyles } from '../../../helpers/withStylesHelper';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import { AppState } from '../../../reducers';
import { blockUnverifiedUser, AUTH_LEVEL } from '../../../helpers/checkAuthDialog';
import { addPaperToRecommendPool } from '../../recommendPool/actions';
import { Paper } from '../../../model/paper';
import { getUserGroupName } from '../../../helpers/abTestHelper';
import { COLLECTION_BUTTON_TEXT_EXPERIMENT } from '../../../constants/abTestGlobalValue';
import { CollectionButtonTextTestType } from '../../../constants/abTestObject';
import { UserDevice } from '../../layouts/reducer';

const styles = require('./collectionButton.scss');

interface CollectionButtonProps {
  paper: Paper;
  saved: boolean;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  buttonStyle?: React.CSSProperties;
}

const selectUserHasCollection = createSelector([(state: AppState) => state.myCollections], myCollections => {
  return myCollections.collectionIds && myCollections.collectionIds.length > 0;
});

const CollectionButton: React.FC<CollectionButtonProps> = ({ saved, paper, pageType, actionArea, buttonStyle }) => {
  const dispatch = useDispatch();
  const userHasCollection = useSelector<AppState, boolean>(selectUserHasCollection);
  const userDevice = useSelector((state: AppState) => state.layout.userDevice);
  const [collectionButtonTextType, setCollectionButtonTextType] = React.useState();

  let buttonContent = 'Save';

  React.useEffect(() => {
    setCollectionButtonTextType(getUserGroupName(COLLECTION_BUTTON_TEXT_EXPERIMENT));
  }, []);

  if (userDevice !== UserDevice.MOBILE) {
    switch (collectionButtonTextType) {
      case CollectionButtonTextTestType.ADD:
        buttonContent = 'Add to Collection';
        break;
      case CollectionButtonTextTestType.KEEP:
        buttonContent = 'Keep';
        break;
      case CollectionButtonTextTestType.READ_LATER:
        buttonContent = 'Read Later';
        break;
      default:
        buttonContent = 'Save';
        break;
    }
  }

  if (saved) {
    buttonContent = 'Saved';
  }

  return (
    <button
      onClick={async () => {
        const actionLabel = saved ? 'addToCollection' : 'savedCollection';
        dispatch(addPaperToRecommendPool({ paperId: paper.id, action: 'addToCollection' }));
        ActionTicketManager.trackTicket({
          pageType,
          actionType: 'fire',
          actionArea,
          actionTag: actionLabel,
          actionLabel: String(paper.id),
        });
        const isBlocked = await blockUnverifiedUser({
          authLevel: AUTH_LEVEL.VERIFIED,
          actionArea: actionArea || pageType,
          actionLabel: actionLabel,
          userActionType: actionLabel,
        });
        if (isBlocked) return;

        if (userHasCollection) GlobalDialogManager.openCollectionDialog(paper.id);
        else GlobalDialogManager.openNewCollectionDialog(paper.id);
      }}
      className={classNames({
        [styles.button]: true,
        [styles.savedButton]: saved,
      })}
      style={buttonStyle}
    >
      <Icon className={styles.bookmarkIcon} icon="BOOKMARK" />
      <span>{buttonContent}</span>
    </button>
  );
};

export default withStyles<typeof CollectionButton>(styles)(CollectionButton);
