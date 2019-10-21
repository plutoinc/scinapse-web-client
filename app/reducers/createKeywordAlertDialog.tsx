import { createSlice, PayloadAction } from 'redux-starter-kit';

interface CreateKeywordAlertDialogState {
  isOpen: boolean;
  from: string;
  keyword: string;
}

export const CREATE_KEYWORD_ALERT_DIALOG_INITIAL_STATE: CreateKeywordAlertDialogState = {
  isOpen: false,
  from: '',
  keyword: '',
};

const createKeywordAlertDialogSlice = createSlice({
  name: 'createKeywordAlertDialogSlice',
  initialState: CREATE_KEYWORD_ALERT_DIALOG_INITIAL_STATE,
  reducers: {
    openCreateKeywordAlertDialog(state, action: PayloadAction<{ from: string; keyword: string }>) {
      return {
        ...state,
        from: action.payload.from,
        keyword: action.payload.keyword,
        isOpen: true,
      };
    },
    closeCreateKeywordAlertDialog(state) {
      return {
        ...state,
        from: '',
        keyword: '',
        isOpen: false,
      };
    },
  },
});

export const { openCreateKeywordAlertDialog, closeCreateKeywordAlertDialog } = createKeywordAlertDialogSlice.actions;

export default createKeywordAlertDialogSlice.reducer;
