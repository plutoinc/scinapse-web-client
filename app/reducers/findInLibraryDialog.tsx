import { createSlice } from '@reduxjs/toolkit';

interface FindInLibraryDialogState {
  isOpen: boolean;
}

export const FIND_IN_LIBRARY_DIALOG_INITIAL_STATE: FindInLibraryDialogState = {
  isOpen: false,
};

const findInLibraryDialogSlice = createSlice({
  name: 'findInLibraryDialog',
  initialState: FIND_IN_LIBRARY_DIALOG_INITIAL_STATE,
  reducers: {
    openFindInLibraryDialog(state) {
      return {
        ...state,
        isOpen: true,
      };
    },
    closeFindInLibraryDialog(state) {
      return {
        ...state,
        isOpen: false,
      };
    },
  },
});

export const { openFindInLibraryDialog, closeFindInLibraryDialog } = findInLibraryDialogSlice.actions;

export default findInLibraryDialogSlice.reducer;
