import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import ImprovedFooter from '../../components/layouts/improvedFooter';
import OnboardingHeader from './components/onboardingHeader';
import OnboardingFooter from './components/onboardingFooter';
import OnboardingBody from './components/onboardingBody';
import { AppState } from '../../reducers';
import PaperImportDialog from '../profile/components/paperImportDialog';
import { useHistory } from 'react-router-dom';
import { ONBOARDING_STEPS, CURRENT_ONBOARDING_PROGRESS_STEP } from './types';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./profileOnboarding.scss');

const ProfileOnboarding: FC = () => {
  useStyles(s);
  const history = useHistory();

  const profileSlug = useSelector((state: AppState) => state.currentUser.profileSlug);
  const { activeStep, skipped } = useSelector((state: AppState) => ({
    activeStep: state.profileOnboardingState.activeStep,
    skipped: state.profileOnboardingState.skipped,
  }));

  if (!profileSlug) {
    history.push('/');
    return null;
  }

  const shouldShowFooter =
    activeStep < ONBOARDING_STEPS.length && activeStep !== CURRENT_ONBOARDING_PROGRESS_STEP.UPLOAD_PUB_LIST;

  return (
    <>
      <div className={s.container}>
        <div className={s.wrapper}>
          <OnboardingHeader activeStep={activeStep} skipped={skipped} />
          <OnboardingBody activeStep={activeStep} profileSlug={profileSlug} />
          <OnboardingFooter activeStep={activeStep} shouldShow={shouldShowFooter} />
        </div>
      </div>
      <PaperImportDialog />
      <ImprovedFooter containerStyle={{ backgroundColor: 'white' }} />
    </>
  );
};

export default ProfileOnboarding;
