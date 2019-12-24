import { createSlice } from '@reduxjs/toolkit';

interface RequestPreprintDialogState {
  isOpen: boolean;
}

export const REQUEST_PREPRINT_DIALOG_INITIAL_STATE: RequestPreprintDialogState = {
  isOpen: false,
};

const requestPreprintSnackBarSlice = createSlice({
  name: 'requestPreprintDialog',
  initialState: REQUEST_PREPRINT_DIALOG_INITIAL_STATE,
  reducers: {
    openRequestPreprintDialog(state) {
      return {
        ...state,
        isOpen: true,
      };
    },
    closeRequestPreprintDialog(state) {
      return {
        ...state,
        isOpen: false,
      };
    },
  },
});

export const { openRequestPreprintDialog, closeRequestPreprintDialog } = requestPreprintSnackBarSlice.actions;

export default requestPreprintSnackBarSlice.reducer;
