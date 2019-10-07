import { createSlice, PayloadAction } from 'redux-starter-kit';
import { RECOMMENDED_PAPER_LOGGING_FOR_NON_USER } from './constans';
import { RecommendationActionParams } from '../../api/types/recommendation';
const store = require('store');

export interface RecommendOnboardingSnackbarState {
  isOpen: boolean;
  actionArea: string;
  tempRecActionLogs: RecommendationActionParams[];
}

export const RECOMMEND_ONBOARDING_SNACKBAR_INITIAL_STATE: RecommendOnboardingSnackbarState = {
  isOpen: false,
  actionArea: '',
  tempRecActionLogs: store.get(RECOMMENDED_PAPER_LOGGING_FOR_NON_USER) || [],
};

const recommendOnboardingSnackbarSlice = createSlice({
  slice: 'recommendOnboardingSnackbar',
  initialState: RECOMMEND_ONBOARDING_SNACKBAR_INITIAL_STATE,
  reducers: {
    addPaperToTempPool: (state, action: PayloadAction<{ recActions: RecommendationActionParams[] }>) => {
      state.tempRecActionLogs = action.payload.recActions;
    },
    openRecommendOnboardingSnackbar(
      state,
      action: PayloadAction<{
        actionArea: string;
      }>
    ) {
      state.isOpen = true;
      state.actionArea = action.payload.actionArea;
    },
    closeRecommendOnboardingSnackbar(state) {
      state.isOpen = false;
      state.actionArea = '';
    },
  },
});

export const {
  addPaperToTempPool,
  openRecommendOnboardingSnackbar,
  closeRecommendOnboardingSnackbar,
} = recommendOnboardingSnackbarSlice.actions;

export default recommendOnboardingSnackbarSlice.reducer;
