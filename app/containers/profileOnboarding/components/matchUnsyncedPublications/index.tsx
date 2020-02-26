import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../reducers';
import PendingPaperList from '../../../profile/components/pendingPaperList';

const MatchUnsyncedPublications: FC = () => {
  const pendingPapers = useSelector((state: AppState) => state.profilePendingPaperListState.papers);

  return (
    <div>
      <PendingPaperList papers={pendingPapers} isEditable={true} />
    </div>
  );
};

export default MatchUnsyncedPublications;
