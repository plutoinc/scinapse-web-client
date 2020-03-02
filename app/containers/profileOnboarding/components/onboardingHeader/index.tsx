import React, { FC } from 'react';
import ProgressStepper from '../../../../components/common/progressStepper';
import { ONBOARDING_STEPS, CURRENT_ONBOARDING_PROGRESS_STEP } from '../../types';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./onboardingHeader.scss');

interface OnboardingHeaderProps {
  activeStep: CURRENT_ONBOARDING_PROGRESS_STEP;
  skipped: CURRENT_ONBOARDING_PROGRESS_STEP[];
}

const OnboardingHeader: FC<OnboardingHeaderProps> = ({ activeStep, skipped }) => {
  useStyles(s);

  return (
    <div className={s.onboardingHeaderWrapper}>
      <ProgressStepper activeStep={activeStep} progressSteps={ONBOARDING_STEPS} skipped={skipped} />
    </div>
  );
};

export default OnboardingHeader;
