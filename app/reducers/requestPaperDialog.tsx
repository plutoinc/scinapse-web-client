import { createSlice } from '@reduxjs/toolkit';

interface RequestPaperDialogState {
  isOpen: boolean;
}

export const REQUEST_PAPER_DIALOG_INITIAL_STATE: RequestPaperDialogState = {
  isOpen: false,
};

const requestPaperSnackBarSlice = createSlice({
  name: 'requestPaperDialog',
  initialState: REQUEST_PAPER_DIALOG_INITIAL_STATE,
  reducers: {
    openRequestPaperDialog(state) {
      return {
        ...state,
        isOpen: true,
      };
    },
    closeRequestPaperDialog(state) {
      return {
        ...state,
        isOpen: false,
      };
    },
  },
});

export const { openRequestPaperDialog, closeRequestPaperDialog } = requestPaperSnackBarSlice.actions;

export default requestPaperSnackBarSlice.reducer;
