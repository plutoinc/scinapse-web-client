import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@pluto_network/pluto-design-elements';
import { ONBOARDING_STEPS, CURRENT_ONBOARDING_PROGRESS_STEP } from '../../types';
import { clickPrevStep, clickSkipStep, clickNextStep } from '../../../../reducers/profileOnboarding';
import { isStepOptional } from '../../helper';

interface OnboardingFooterProps {
  activeStep: CURRENT_ONBOARDING_PROGRESS_STEP;
}

const OnboardingFooter: FC<OnboardingFooterProps> = ({ activeStep }) => {
  const dispatch = useDispatch();
  const showFooterButtons =
    activeStep < ONBOARDING_STEPS.length && activeStep !== CURRENT_ONBOARDING_PROGRESS_STEP.UPLOAD_PUB_LIST;

  return (
    <div>
      {showFooterButtons && (
        <div>
          <div>
            <Button elementType="button" onClick={() => dispatch(clickPrevStep())}>
              Prev
            </Button>
            {isStepOptional(activeStep) && (
              <Button variant="contained" elementType="button" onClick={() => dispatch(clickSkipStep())}>
                Skip
              </Button>
            )}
            <Button variant="contained" elementType="button" onClick={() => dispatch(clickNextStep())}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingFooter;
