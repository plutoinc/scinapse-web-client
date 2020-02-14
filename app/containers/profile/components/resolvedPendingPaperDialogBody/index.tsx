import React, { FC, useState } from 'react';
import FindPaperOfPendingPaperForm from '../findPaperOfPendingPaperForm';
import { PendingPaper } from '../../../../reducers/profilePendingPaperList';

export enum CURRENT_STEP {
  FIND_PAPER,
  FIND_AUTHOR,
}

interface ResolvedPendingPaperDialogBodyProps {
  isLoading: boolean;
  paper: PendingPaper;
}

const ResolvedPendingPaperDialogBody: FC<ResolvedPendingPaperDialogBodyProps> = ({ isLoading, paper }) => {
  const [currentStep, setCurrentStep] = useState<CURRENT_STEP>(CURRENT_STEP.FIND_PAPER);
  if (currentStep === CURRENT_STEP.FIND_PAPER)
    return <FindPaperOfPendingPaperForm recommendedPaperId={paper.paperId} />;
  return <div>FIND_AUTHOR</div>;
};

export default ResolvedPendingPaperDialogBody;
