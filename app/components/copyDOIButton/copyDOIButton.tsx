import React, { FC } from 'react';
import Icon from '../../icons';
import copySelectedTextToClipboard from '../../helpers/copySelectedTextToClipboard';
import ActionTicketManager from '../../helpers/actionTicketManager';

interface Props {
  doi: string;
  paperId: number;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  className?: string;
}

const CopyDOIButton: FC<Props> = ({ doi, paperId, className, pageType, actionArea }) => {
  if (!doi) return null;

  const clickDOIButton = () => {
    copySelectedTextToClipboard(`https://doi.org/${doi}`);
    ActionTicketManager.trackTicket({
      pageType,
      actionType: 'fire',
      actionArea,
      actionTag: 'copyDoi',
      actionLabel: String(paperId),
    });
  };

  return (
    <button className={className} onClick={clickDOIButton}>
      <Icon icon="COPY_DOI" />
      <span>Copy DOI</span>
    </button>
  );
};

export default CopyDOIButton;
