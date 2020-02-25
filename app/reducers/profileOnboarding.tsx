import { createSlice } from '@reduxjs/toolkit';
import { CURRENT_ONBOARDING_PROGRESS_STEP } from '../containers/profileOnboarding/types';
import { isStepOptional } from '../containers/profileOnboarding/helper';

interface ProfileOnboardingState {
  activeStep: CURRENT_ONBOARDING_PROGRESS_STEP;
  skipped: CURRENT_ONBOARDING_PROGRESS_STEP[];
}

export const PROFILE_ONBOARDING_INITIAL_STATE: ProfileOnboardingState = {
  activeStep: CURRENT_ONBOARDING_PROGRESS_STEP.UPLOAD_PUB_LIST,
  skipped: [],
};

const profileOnboardingSlice = createSlice({
  name: 'profileOnboarding',
  initialState: PROFILE_ONBOARDING_INITIAL_STATE,
  reducers: {
    clickNextStep(state) {
      const prevSkipped = state.skipped;
      let newSkipped = prevSkipped;

      if (prevSkipped.includes(state.activeStep)) {
        newSkipped = prevSkipped.filter(skipped => skipped !== state.activeStep);
      }

      return {
        ...state,
        activeStep: state.activeStep + 1,
        skipped: newSkipped,
      };
    },
    clickPrevStep(state) {
      return {
        ...state,
        activeStep: state.activeStep - 1,
      };
    },
    clickSkipStep(state) {
      if (!isStepOptional(state.activeStep)) {
        // You probably want to guard against something like this,
        // it should never occur unless someone's actively trying to break something.
        throw new Error("You can't skip a step that isn't optional.");
      }

      return {
        ...state,
        activeStep: state.activeStep + 1,
        skipped: [...state.skipped, state.activeStep],
      };
    },
  },
});

export const { clickNextStep, clickPrevStep, clickSkipStep } = profileOnboardingSlice.actions;

export default profileOnboardingSlice.reducer;
