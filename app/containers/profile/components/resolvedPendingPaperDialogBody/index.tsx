import React, { FC, useState } from 'react';
import FindPaperOfPendingPaperForm from '../findPaperOfPendingPaperForm';
import { PendingPaper } from '../../../../reducers/profilePendingPaperList';
import { useDispatch } from 'react-redux';
import { markTryAgainProfilePendingPaper } from '../../../../actions/profile';
import FindAuthorOfPendingPaperForm from '../findAuthorOfPendingPaperForm';

export enum CURRENT_STEP {
  FIND_PAPER,
  FIND_AUTHOR,
}

interface ResolvedPendingPaperDialogBodyProps {
  paper: PendingPaper;
  handleCloseDialog: () => void;
}

const ResolvedPendingPaperDialogBody: FC<ResolvedPendingPaperDialogBodyProps> = ({ paper, handleCloseDialog }) => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState<CURRENT_STEP>(CURRENT_STEP.FIND_PAPER);
  const [targetResolvedPaperId, setTargetResolvedPaperId] = useState<string>('');

  const handleClickNextBtn = async (targetPaperId: string | null) => {
    if (!targetPaperId) {
      await dispatch(markTryAgainProfilePendingPaper(paper.id));
      return handleCloseDialog();
    }

    setTargetResolvedPaperId(targetPaperId);
    setCurrentStep(CURRENT_STEP.FIND_AUTHOR);
  };

  if (currentStep === CURRENT_STEP.FIND_PAPER)
    return (
      <FindPaperOfPendingPaperForm
        recommendedPaperId={paper.paperId}
        onClickNextBtn={handleClickNextBtn}
        onCloseDialog={handleCloseDialog}
      />
    );

  return (
    <FindAuthorOfPendingPaperForm
      targetResolvedPaperId={targetResolvedPaperId}
      pendingPaperId={paper.id}
      onCloseDialog={handleCloseDialog}
    />
  );
};

export default ResolvedPendingPaperDialogBody;
