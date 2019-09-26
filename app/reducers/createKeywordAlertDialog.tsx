import { createSlice, PayloadAction } from 'redux-starter-kit';

interface CreateKeywordAlertDialogState {
  isOpen: boolean;
  from: string;
}

export const CREATE_KEYWORD_ALERT_DIALOG_INITIAL_STATE: CreateKeywordAlertDialogState = {
  isOpen: false,
  from: '',
};

const createKeywordAlertDialogSlice = createSlice({
  slice: 'createKeywordAlertDialogSlice',
  initialState: CREATE_KEYWORD_ALERT_DIALOG_INITIAL_STATE,
  reducers: {
    openCreateKeywordAlertDialog(state, action: PayloadAction<{ from: string }>) {
      return {
        ...state,
        from: action.payload.from,
        isOpen: true,
      };
    },
    closeCreateKeywordAlertDialog(state) {
      return {
        ...state,
        from: '',
        isOpen: false,
      };
    },
  },
});

export const { openCreateKeywordAlertDialog, closeCreateKeywordAlertDialog } = createKeywordAlertDialogSlice.actions;

export default createKeywordAlertDialogSlice.reducer;
