import React, { FC, useMemo } from 'react';
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
  const { totalImportedCount, successCount, pendingCount } = useSelector((appState: AppState) => ({
    totalImportedCount: appState.importPaperDialogState.totalImportedCount,
    successCount: appState.importPaperDialogState.successCount,
    pendingCount: appState.importPaperDialogState.pendingCount,
  }));

  const showFooterButtons =
    activeStep < ONBOARDING_STEPS.length && activeStep !== CURRENT_ONBOARDING_PROGRESS_STEP.UPLOAD_PUB_LIST;

  const onClickNextBtn = () => {
    dispatch(clickNextStep());

    if (activeStep === CURRENT_ONBOARDING_PROGRESS_STEP.MATCH_UNSYNCED_PUBS && totalImportedCount < 10) {
      dispatch(clickSkipStep());
    }
  };

  const importPublicationCount = useMemo(
    () => (
      <div>
        <div>
          Total upload count<span>{`(${totalImportedCount})`}</span>
        </div>
        <div>
          Success <span>{`(${successCount})`}</span>
          {` | `}
          Pending <span>{`(${pendingCount})`}</span>
        </div>
      </div>
    ),
    [totalImportedCount, successCount, pendingCount]
  );

  return (
    <div>
      {showFooterButtons && (
        <div>
          <Button elementType="button" onClick={() => dispatch(clickPrevStep())}>
            Prev
          </Button>
          {activeStep === CURRENT_ONBOARDING_PROGRESS_STEP.MATCH_UNSYNCED_PUBS && importPublicationCount}
          {isStepOptional(activeStep) && (
            <Button
              variant="contained"
              elementType="button"
              onClick={() => {
                if (activeStep === CURRENT_ONBOARDING_PROGRESS_STEP.MATCH_UNSYNCED_PUBS) {
                  return onClickNextBtn();
                }

                dispatch(clickSkipStep());
              }}
            >
              {activeStep === ONBOARDING_STEPS.length ? 'Done' : 'Next'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default OnboardingFooter;
