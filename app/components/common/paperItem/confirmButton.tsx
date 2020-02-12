import React from 'react';
import { Button } from '@pluto_network/pluto-design-elements';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import { Paper } from '../../../model/paper';

interface ConfirmButtonProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  className?: string;
  isMobile?: boolean;
  onConfirmedPaper?: () => void;
  isLoading?: boolean;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  paper,
  pageType,
  actionArea,
  className,
  isLoading,
  onConfirmedPaper,
}) => {
  if (!onConfirmedPaper) return null;

  return (
    <div className={className}>
      <Button
        elementType="button"
        aria-label="Confirm button"
        size="small"
        variant={'contained'}
        color={'blue'}
        onClick={async () => {
          ActionTicketManager.trackTicket({
            pageType,
            actionType: 'fire',
            actionArea: actionArea || pageType,
            actionTag: 'confirmedPaper',
            actionLabel: String(paper.id),
          });
          onConfirmedPaper();
        }}
        isLoading={isLoading}
      >
        <Icon icon="CHECK" />
        <span>Accept</span>
      </Button>
    </div>
  );
};
export default ConfirmButton;
