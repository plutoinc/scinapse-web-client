import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@pluto_network/pluto-design-elements';
import { ONBOARDING_STEPS, CURRENT_ONBOARDING_PROGRESS_STEP } from '../../types';
import { clickPrevStep, clickSkipStep, clickNextStep } from '../../../../reducers/profileOnboarding';
import { isStepOptional } from '../../helper';
import { AppState } from '../../../../reducers';

interface OnboardingFooterProps {
  activeStep: CURRENT_ONBOARDING_PROGRESS_STEP;
}

const OnboardingFooter: FC<OnboardingFooterProps> = ({ activeStep }) => {
  const dispatch = useDispatch();
  const { totalImportedCount } = useSelector((appState: AppState) => ({
    totalImportedCount: appState.importPaperDialogState.totalImportedCount,
  }));

  const showFooterButtons =
    activeStep < ONBOARDING_STEPS.length && activeStep !== CURRENT_ONBOARDING_PROGRESS_STEP.UPLOAD_PUB_LIST;

  const onClickNextBtn = () => {
    dispatch(clickNextStep());

    if (activeStep === CURRENT_ONBOARDING_PROGRESS_STEP.MATCH_UNSYNCED_PUBS && totalImportedCount < 10) {
      dispatch(clickSkipStep());
    }
  };

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
            {!isStepOptional(activeStep) && (
              <Button variant="contained" elementType="button" onClick={onClickNextBtn}>
                {activeStep === CURRENT_ONBOARDING_PROGRESS_STEP.RESULT ? 'Done' : 'Next'}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingFooter;
