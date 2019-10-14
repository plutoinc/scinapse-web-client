import { createSlice, PayloadAction } from 'redux-starter-kit';
import { KeywordSettingItemResponse } from '../api/types/member';

export interface KeywordSettingsState {
  isLoading: boolean;
  keywords: KeywordSettingItemResponse[];
}

export const KEYWORD_SETTINGS_INITIAL_STATE: KeywordSettingsState = { isLoading: false, keywords: [] };

const keywordSettingsSlice = createSlice({
  slice: 'keywordSettings',
  initialState: KEYWORD_SETTINGS_INITIAL_STATE,
  reducers: {
    startToConnectKeywordSettingsAPI(state) {
      return { ...state, isLoading: true };
    },
    succeedToConnectKeywordSettingsAPI(state, action: PayloadAction<{ keywords: KeywordSettingItemResponse[] }>) {
      return { ...state, isLoading: false, keywords: action.payload.keywords };
    },
    failedToConnectKeywordSettingsAPI(state) {
      return { ...state, isLoading: false };
    },
    clearToKeywordSettings(state) {
      return { ...state, keywords: [] };
    },
  },
});

export const {
  startToConnectKeywordSettingsAPI,
  succeedToConnectKeywordSettingsAPI,
  failedToConnectKeywordSettingsAPI,
  clearToKeywordSettings,
} = keywordSettingsSlice.actions;

export default keywordSettingsSlice.reducer;
