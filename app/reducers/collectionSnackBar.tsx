import { createSlice, PayloadAction } from 'redux-starter-kit';

export interface CollectionSnackBarState {
  isOpen: boolean;
  collectionId: number;
  collectionName: string;
}

export const COLLECTION_SNACK_BAR_INITIAL_STATE = { isOpen: false, collectionId: 0, collectionName: '' };

const collectionSnackBarSlice = createSlice({
  slice: 'collectionSnackBar',
  initialState: COLLECTION_SNACK_BAR_INITIAL_STATE,
  reducers: {
    openCollectionSnackBar(state, action: PayloadAction<{ collectionId: number; collectionName: string }>) {
      return {
        ...state,
        isOpen: true,
        collectionId: action.payload.collectionId,
        collectionName: action.payload.collectionName,
      };
    },
    closeCollectionSnackBar(state) {
      return {
        ...state,
        isOpen: false,
      };
    },
  },
});

export const { openCollectionSnackBar, closeCollectionSnackBar } = collectionSnackBarSlice.actions;

export default collectionSnackBarSlice.reducer;
