import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProfilePaperListState {
  currentPage: number;
  paperIds: string[];
  maxPage: number;
  totalCount: number;
}

interface GetPapersPayload {
  paperIds: string[];
  totalPages: number;
  page: number;
  totalElements: number;
}

export const PROFILE_PAPER_LIST_INITIAL_STATE: ProfilePaperListState = {
  paperIds: [],
  currentPage: 0,
  maxPage: 0,
  totalCount: 0,
};

const profilePaperListSlice = createSlice({
  name: 'profilePageSlice',
  initialState: PROFILE_PAPER_LIST_INITIAL_STATE,
  reducers: {
    getPapers(state, action: PayloadAction<GetPapersPayload>) {
      state.currentPage = action.payload.page;
      state.totalCount = action.payload.totalElements;
      state.maxPage = action.payload.totalPages;
      state.paperIds = action.payload.paperIds;
    },
  },
});

export const { getPapers } = profilePaperListSlice.actions;

export default profilePaperListSlice.reducer;
