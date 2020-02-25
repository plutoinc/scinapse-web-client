import React, { FC } from 'react';
import ProgressStepper from '../../../../components/common/progressStepper';
import { ONBOARDING_STEPS, CURRENT_ONBOARDING_PROGRESS_STEP } from '../../types';

interface OnboardingHeaderProps {
  activeStep: CURRENT_ONBOARDING_PROGRESS_STEP;
  skipped: CURRENT_ONBOARDING_PROGRESS_STEP[];
}

const OnboardingHeader: FC<OnboardingHeaderProps> = ({ activeStep, skipped }) => {
  return (
    <>
      <ProgressStepper activeStep={activeStep} progressSteps={ONBOARDING_STEPS} skipped={skipped} />
    </>
  );
};

export default OnboardingHeader;
