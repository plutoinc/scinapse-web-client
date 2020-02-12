import React, { useState } from 'react';
import { Paper } from '../../../model/paper';
import DeclineButton from './declineButton';
import ConfirmButton from './confirmButton';
import ProfileAPI from '../../../api/profile';
import PlutoAxios from '../../../api/pluto';
import alertToast from '../../../helpers/makePlutoToastAction';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./paperItemButtonGroup.scss');

interface ResolveUnconfirmedButtonsProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  fetchProfileShowData: () => void;
  className?: string;
  isMobile?: boolean;
  ownProfileId?: string;
}

const ResolveUnconfirmedButtons: React.FC<ResolveUnconfirmedButtonsProps> = props => {
  const { paper, pageType, actionArea, ownProfileId, isMobile, fetchProfileShowData } = props;
  useStyles(s);
  const [isLoading, setIsLoading] = useState(false);

  if (!ownProfileId) return null;

  const handleDeclinedPaper = () => {
    setIsLoading(true);

    ProfileAPI.declinedPaper({ profileId: ownProfileId, paperId: paper.id })
      .then(() => {
        fetchProfileShowData();
        setIsLoading(false);
      })
      .catch(err => {
        const error = PlutoAxios.getGlobalError(err);
        alertToast({
          type: 'error',
          message: error.message,
        });
        setIsLoading(false);
      });
  };

  const handleConfirmedPaper = () => {
    setIsLoading(true);

    ProfileAPI.confirmedPaper({ profileId: ownProfileId, paperId: paper.id })
      .then(() => {
        fetchProfileShowData();
        setIsLoading(false);
      })
      .catch(err => {
        const error = PlutoAxios.getGlobalError(err);
        alertToast({
          type: 'error',
          message: error.message,
        });
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className={s.buttonWrapper}>
        <DeclineButton
          paper={paper}
          pageType={pageType}
          actionArea={actionArea}
          isLoading={isLoading}
          isMobile={isMobile}
          onDeclinedPaper={handleDeclinedPaper}
        />
      </div>
      <div className={s.buttonWrapper}>
        <ConfirmButton
          paper={paper}
          pageType={pageType}
          actionArea={actionArea}
          isLoading={isLoading}
          isMobile={isMobile}
          onConfirmedPaper={handleConfirmedPaper}
        />
      </div>
    </>
  );
};

export default ResolveUnconfirmedButtons;
