import React, { FC } from 'react';
import ProgressStepper from '../../../../components/common/progressStepper';
import { ONBOARDING_STEPS } from '../../types';

interface OnboardingHeaderProps {
  activeStep: number;
  handleStepOptionalFlag: (step: number) => boolean;
  handleStepSkippedFlag: (step: number) => boolean;
}

const OnboardingHeader: FC<OnboardingHeaderProps> = ({ activeStep, handleStepOptionalFlag, handleStepSkippedFlag }) => {
  return (
    <>
      <ProgressStepper
        activeStep={activeStep}
        progressSteps={ONBOARDING_STEPS}
        isStepOptional={handleStepOptionalFlag}
        isStepSkipped={handleStepSkippedFlag}
      />
    </>
  );
};

export default OnboardingHeader;
