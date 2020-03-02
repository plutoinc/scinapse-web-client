import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button } from '@pluto_network/pluto-design-elements';
import { AppState } from '../../../../reducers';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./onboardingResult.scss');

interface OnboardingResultProps {
  profileSlug: string;
}

const PaperStatsItem: FC<{ title: string; statsCount: number }> = ({ title, statsCount }) => {
  return (
    <div className={s.paperStatsItemWrapper}>
      <div className={s.paperStatsItemHeader}>{title}</div>
      <div className={s.paperStatsItemBody}>{statsCount}</div>
    </div>
  );
};

const OnboardingResult: FC<OnboardingResultProps> = ({ profileSlug }) => {
  useStyles(s);
  const history = useHistory();

  const { allPaperCount, pendingPaperCount, representativePaperCount } = useSelector((appState: AppState) => ({
    allPaperCount: appState.profilePaperListState.totalCount,
    pendingPaperCount: appState.profilePendingPaperListState.papers.length,
    representativePaperCount: appState.profileRepresentativePaperListState.totalCount,
  }));

  return (
    <div className={s.onboardingResultWrapper}>
      <div className={s.title}>Congratulations</div>
      <div className={s.paperStatsWrapper}>
        <PaperStatsItem title="Total" statsCount={allPaperCount + pendingPaperCount} />
        <PaperStatsItem title="Representative" statsCount={representativePaperCount} />
        <PaperStatsItem title="Pending" statsCount={pendingPaperCount} />
      </div>
      <div className={s.ctaButtonWrapper}>
        <Button elementType="button" size="large" fullWidth onClick={() => history.push(`/profiles/${profileSlug}`)}>
          <span>Go to my Profile</span>
        </Button>
      </div>
    </div>
  );
};

export default OnboardingResult;
