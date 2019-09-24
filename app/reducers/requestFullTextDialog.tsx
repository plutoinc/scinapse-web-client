import { createSlice, PayloadAction } from 'redux-starter-kit';

type RequestFullTextDialogActionArea = 'refCited' | 'actionBar';

interface RequestFullTextDialogState {
  isOpen: boolean;
  from: RequestFullTextDialogActionArea | '';
}

export const REQUEST_FULL_TEXT_DIALOG_INITIAL_STATE: RequestFullTextDialogState = {
  isOpen: false,
  from: '',
};

const collectionSnackBarSlice = createSlice({
  slice: 'requestFullTextDialog',
  initialState: REQUEST_FULL_TEXT_DIALOG_INITIAL_STATE,
  reducers: {
    openRequestFullTextDialog(state, action: PayloadAction<{ from: RequestFullTextDialogActionArea }>) {
      return {
        ...state,
        from: action.payload.from,
        isOpen: true,
      };
    },
    closeRequestFullTextDialog(state) {
      return {
        ...state,
        from: '' as RequestFullTextDialogActionArea,
        isOpen: false,
      };
    },
  },
});

export const { openRequestFullTextDialog, closeRequestFullTextDialog } = collectionSnackBarSlice.actions;

export default collectionSnackBarSlice.reducer;
