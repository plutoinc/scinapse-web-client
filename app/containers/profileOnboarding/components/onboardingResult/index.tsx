import React, { FC } from 'react';
import { AppState } from '../../../../reducers';
import { useSelector } from 'react-redux';

const OnboardingResult: FC = () => {
  const { allPaperCount, pendingPaperCount, representativePaperCount } = useSelector((appState: AppState) => ({
    allPaperCount: appState.profilePaperListState.totalCount,
    pendingPaperCount: appState.profilePendingPaperListState.papers.length,
    representativePaperCount: appState.profileRepresentativePaperListState.totalCount,
  }));

  return (
    <div>
      <div>total uploaded paper count : {allPaperCount + pendingPaperCount}</div>
      <div>pending paper count : {pendingPaperCount}</div>
      <div>representative paper count : {representativePaperCount}</div>
    </div>
  );
};

export default OnboardingResult;
