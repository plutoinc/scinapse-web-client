import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@pluto_network/pluto-design-elements';
import { PendingPaper } from '../../../../reducers/profilePendingPaperList';
import Icon from '../../../../icons';
import { removeProfilePendingPaper } from '../../../../actions/profile';
import PlutoAxios from '../../../../api/pluto';
import alertToast from '../../../../helpers/makePlutoToastAction';
import GlobalDialogManager from '../../../../helpers/globalDialogManager';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./pendingPaperItem.scss');

interface PendingPaperItemProps {
  paper: PendingPaper;
  isEditable: boolean;
}

const PendingPaperItem: React.FC<PendingPaperItemProps> = ({ paper, isEditable }) => {
  useStyles(s);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const yearNode = !paper.year ? '' : paper.year + ` ・ `;
  const journalNode = !paper.journal ? '' : paper.journal + ` | `;
  const authorsNode = !paper.author ? '' : paper.author;
  const resolveBtnContextNode = !paper.tryAgain ? 'Resolve' : 'Try Again';

  const onRemovePendingPaper = async () => {
    setIsLoading(true);

    const removeConfirm = confirm('Do you really want to REMOVE this pending paper?');

    if (!removeConfirm) {
      return setIsLoading(false);
    }

    try {
      await dispatch(removeProfilePendingPaper(paper.id));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      const error = PlutoAxios.getGlobalError(err);
      alertToast({ type: 'error', message: error.message });
    }
  };

  return (
    <div className={s.pendingPaperItemWrapper}>
      <div className={s.pendingPaperContentsWrapper}>
        <div className={s.pendingPaperItemTitle}>{paper.title}</div>
        <div className={s.pendingPaperItemVenueAndAuthor}>
          {yearNode}
          {journalNode}
          {authorsNode}
        </div>
      </div>
      {isEditable && (
        <>
          <div className={s.resolveBtnWrapper}>
            <Button
              elementType="button"
              size="small"
              color="gray"
              isLoading={isLoading}
              onClick={() => GlobalDialogManager.openResolvedPendingPaperDialog(paper)}
            >
              <span>{resolveBtnContextNode}</span>
            </Button>
          </div>
          <div className={s.removeBtnWrapper}>
            <Button
              elementType="button"
              size="small"
              color="gray"
              variant="text"
              onClick={onRemovePendingPaper}
              isLoading={isLoading}
            >
              <Icon icon="X_BUTTON" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PendingPaperItem;
