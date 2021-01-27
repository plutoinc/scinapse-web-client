import React, { useCallback, useState } from 'react';
import { Button } from '@pluto_network/pluto-design-elements';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import { Paper } from '../../../model/paper';
import { useDispatch, useSelector } from 'react-redux';
import { addAuthorPublication, removeAuthorPublication } from '../../../actions/profile';
import PlutoAxios from '../../../api/pluto';
import alertToast from '../../../helpers/makePlutoToastAction';
import { AppState } from '../../../reducers';

interface ResolveNotIncludedButtonProps {
  paper: Paper;
  ownProfileSlug: string;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  className?: string;
  isMobile?: boolean;
}

const ResolveNotIncludedButton: React.FC<ResolveNotIncludedButtonProps> = ({
  paper,
  pageType,
  actionArea,
  className,
  ownProfileSlug,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { isIncluded } = useSelector((state: AppState) => ({
    isIncluded: state.profilePaperListState.paperIds.includes(paper.id),
  }));

  const onAddPublication = useCallback(async () => {
    try {
      setIsLoading(true);

      await dispatch(addAuthorPublication({ profileSlug: ownProfileSlug, paperId: paper.id }));

      setIsLoading(false);
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      alertToast({
        type: 'error',
        message: error.message,
      });
      setIsLoading(false);
    }
  }, [dispatch, ownProfileSlug, paper.id]);

  const onRemovePublication = useCallback(async () => {
    try {
      setIsLoading(true);

      await dispatch(removeAuthorPublication({ profileSlug: ownProfileSlug, paperId: paper.id }));

      setIsLoading(false);
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      alertToast({
        type: 'error',
        message: error.message,
      });
      setIsLoading(false);
    }
  }, [dispatch, ownProfileSlug, paper.id]);

  return (
    <div className={className}>
      <Button
        elementType="button"
        aria-label="Resolved not included button"
        size="small"
        variant={'contained'}
        color={isIncluded ? 'gray' : 'blue'}
        onClick={async () => {
          ActionTicketManager.trackTicket({
            pageType,
            actionType: 'fire',
            actionArea: actionArea || pageType,
            actionTag: isIncluded ? 'removePaperToProfile' : 'addPaperToProfile',
            actionLabel: String(paper.id),
          });

          if (isIncluded) {
            onRemovePublication();
          } else {
            onAddPublication();
          }
        }}
        isLoading={isLoading}
      >
        <Icon icon={isIncluded ? 'MINUS' : 'PLUS'} />
        <span>{isIncluded ? 'Remove' : 'Add'}</span>
      </Button>
    </div>
  );
};
export default ResolveNotIncludedButton;
