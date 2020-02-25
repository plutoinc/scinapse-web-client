import React, { FC } from 'react';
import { Button } from '@pluto_network/pluto-design-elements';
import { ONBOARDING_STEPS } from '../../types';

interface OnboardingFooterProps {
  activeStep: number;
  onClickBackBtn: () => void;
  onClickSkipBtn: () => void;
  onClickNextBtn: () => void;
  isStepOptional: (step: number) => boolean;
}

const OnboardingFooter: FC<OnboardingFooterProps> = ({
  activeStep,
  onClickBackBtn,
  onClickSkipBtn,
  onClickNextBtn,
  isStepOptional,
}) => {
  return (
    <div>
      {activeStep < ONBOARDING_STEPS.length ? (
        <div>
          <div>
            <Button elementType="button" disabled={activeStep === 0} onClick={onClickBackBtn}>
              Back
            </Button>
            {isStepOptional(activeStep) && (
              <Button variant="contained" elementType="button" onClick={onClickSkipBtn}>
                Skip
              </Button>
            )}
            <Button variant="contained" elementType="button" onClick={onClickNextBtn}>
              Next
            </Button>
          </div>
        </div>
      ) : (
        <div>FINISHED</div>
      )}
    </div>
  );
};

export default OnboardingFooter;
