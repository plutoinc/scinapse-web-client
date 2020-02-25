import React, { FC } from 'react';
import ImprovedFooter from '../../components/layouts/improvedFooter';
import { CURRENT_ONBOARDING_PROGRESS_STEP } from './types';
import OnboardingHeader from './components/onboardingHeader';
import OnboardingFooter from './components/onboardingFooter';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./profileOnboarding.scss');

const ProfileOnboarding: FC = () => {
  useStyles(s);
  const [activeStep, setActiveStep] = React.useState<CURRENT_ONBOARDING_PROGRESS_STEP>(
    CURRENT_ONBOARDING_PROGRESS_STEP.UPLOAD_PUB_LIST
  );
  const [skipped, setSkipped] = React.useState(new Set<CURRENT_ONBOARDING_PROGRESS_STEP>());

  const isStepOptional = (step: CURRENT_ONBOARDING_PROGRESS_STEP) => {
    return (
      step === CURRENT_ONBOARDING_PROGRESS_STEP.MATCH_UNSYNCED_PUBS ||
      step === CURRENT_ONBOARDING_PROGRESS_STEP.SELECT_REPRESENTATIVE_PUBS
    );
  };

  const isStepSkipped = (step: CURRENT_ONBOARDING_PROGRESS_STEP) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  return (
    <>
      <div className={s.container}>
        <div className={s.wrapper}>
          <OnboardingHeader
            activeStep={activeStep}
            handleStepOptionalFlag={isStepOptional}
            handleStepSkippedFlag={isStepSkipped}
          />
          <OnboardingFooter
            activeStep={activeStep}
            onClickBackBtn={handleBack}
            onClickSkipBtn={handleSkip}
            onClickNextBtn={handleNext}
            isStepOptional={isStepOptional}
          />
        </div>
      </div>
      <ImprovedFooter containerStyle={{ backgroundColor: 'white' }} />
    </>
  );
};

export default ProfileOnboarding;
