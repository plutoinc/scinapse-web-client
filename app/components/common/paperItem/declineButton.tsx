import React from 'react';
import { Button } from '@pluto_network/pluto-design-elements';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import { Paper } from '../../../model/paper';

interface DeclineButtonProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  className?: string;
  isMobile?: boolean;
  onDeclinedPaper?: () => void;
  isLoading?: boolean;
}

const DeclineButton: React.FC<DeclineButtonProps> = ({
  paper,
  pageType,
  actionArea,
  className,
  isMobile,
  isLoading,
  onDeclinedPaper,
}) => {
  if (!onDeclinedPaper) return null;

  return (
    <div className={className}>
      <Button
        elementType="button"
        aria-label="Decline button"
        size="small"
        variant={isMobile ? 'contained' : 'outlined'}
        color={isMobile ? 'black' : 'blue'}
        onClick={async () => {
          ActionTicketManager.trackTicket({
            pageType,
            actionType: 'fire',
            actionArea: actionArea || pageType,
            actionTag: 'declinedPaper',
            actionLabel: String(paper.id),
          });
          onDeclinedPaper();
        }}
        isLoading={isLoading}
      >
        <Icon icon="MINUS" />
        <span>Decline</span>
      </Button>
    </div>
  );
};
export default DeclineButton;
