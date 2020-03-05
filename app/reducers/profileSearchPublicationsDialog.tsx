import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProfileSearchPublicationsDialogState {
  isOpen: boolean;
  paperIds: string[];
  currentPage: number;
  maxPage: number;
  totalCount: number;
}

interface GetPapersPayload {
  paperIds: string[];
  totalPages: number;
  page: number;
  totalElements: number;
}

export const PROFILE_SEARCH_PUBLICATIONS_DIALOG_INITIAL_STATE: ProfileSearchPublicationsDialogState = {
  isOpen: false,
  paperIds: [],
  currentPage: 0,
  maxPage: 0,
  totalCount: 0,
};

const profileSearchPublicationsDialogSlice = createSlice({
  name: 'profileSearchPublicationsDialogSlice',
  initialState: PROFILE_SEARCH_PUBLICATIONS_DIALOG_INITIAL_STATE,
  reducers: {
    openSearchPublicationsDialog(state) {
      state.isOpen = true;
    },
    closeSearchPublicationsDialog() {
      return PROFILE_SEARCH_PUBLICATIONS_DIALOG_INITIAL_STATE;
    },
    getSearchPublications(state, action: PayloadAction<GetPapersPayload>) {
      state.currentPage = action.payload.page;
      state.totalCount = action.payload.totalElements;
      state.maxPage = action.payload.totalPages;
      state.paperIds = action.payload.paperIds;
    },
  },
});

export const {
  openSearchPublicationsDialog,
  closeSearchPublicationsDialog,
  getSearchPublications,
} = profileSearchPublicationsDialogSlice.actions;

export default profileSearchPublicationsDialogSlice.reducer;
