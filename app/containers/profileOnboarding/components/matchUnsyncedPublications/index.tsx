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
      <div className={s.title}>Match unsynced publications</div>
      <div className={s.contextWrapper}>
        <div className={s.subContext}>
          <span>We couldn't automatically find the below publications from Scinapse Database.</span>
          <br />
          <span>Please make these publications match with Scinapse Database.</span>
        </div>
        <div className={s.guideContext}>
          <span>
            You can <span className={s.highlightContext}>SKIP</span> this step. However, below publications will be
            shown as <span className={s.highlightContext}>PENDING PUBLICATIONS.</span>
          </span>
        </div>
      </div>
      <PendingPaperList papers={pendingPapers} isEditable={true} />
    </div>
  );
};

export default MatchUnsyncedPublications;
