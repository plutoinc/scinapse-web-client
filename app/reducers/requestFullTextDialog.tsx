import { createSlice } from 'redux-starter-kit';

interface RequestFullTextDialogState {
  isOpen: boolean;
}

export const REQUEST_FULL_TEXT_DIALOG_INITIAL_STATE: RequestFullTextDialogState = {
  isOpen: false,
};

const collectionSnackBarSlice = createSlice({
  name: 'requestFullTextDialog',
  initialState: REQUEST_FULL_TEXT_DIALOG_INITIAL_STATE,
  reducers: {
    openRequestFullTextDialog(state) {
      return {
        ...state,
        isOpen: true,
      };
    },
    closeRequestFullTextDialog(state) {
      return {
        ...state,
        isOpen: false,
      };
    },
  },
});

export const { openRequestFullTextDialog, closeRequestFullTextDialog } = collectionSnackBarSlice.actions;

export default collectionSnackBarSlice.reducer;
