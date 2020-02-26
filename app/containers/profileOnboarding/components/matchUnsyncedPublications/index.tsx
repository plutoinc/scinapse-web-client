import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../reducers';
import PendingPaperList from '../../../profile/components/pendingPaperList';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./matchUnsyncedPublications.scss');

const MatchUnsyncedPublications: FC = () => {
  useStyles(s);
  const pendingPapers = useSelector((state: AppState) => state.profilePendingPaperListState.papers);

  return (
    <div className={s.matchUnsyncedPublicationsWrapper}>
      <PendingPaperList papers={pendingPapers} isEditable={true} />
    </div>
  );
};

export default MatchUnsyncedPublications;
