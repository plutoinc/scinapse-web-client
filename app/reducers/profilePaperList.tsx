import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { remove } from 'lodash';

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
  name: 'profilePaperListSlice',
  initialState: PROFILE_PAPER_LIST_INITIAL_STATE,
  reducers: {
    getAllPapers(state, action: PayloadAction<GetPapersPayload>) {
      state.currentPage = action.payload.page;
      state.totalCount = action.payload.totalElements;
      state.maxPage = action.payload.totalPages;
      state.paperIds = action.payload.paperIds;
    },
    addPaper(state, action: PayloadAction<{ paperId: string }>) {
      state.totalCount = state.totalCount + 1;
      state.paperIds = [action.payload.paperId, ...state.paperIds];
    },
    removePaper(state, action: PayloadAction<{ paperId: string }>) {
      const prevPaperIds = state.paperIds;
      const nextPaperIds = remove(prevPaperIds, paperId => paperId !== action.payload.paperId);

      state.paperIds = nextPaperIds;
      state.totalCount = state.totalCount - 1;
    },
  },
});

export const { getAllPapers, addPaper, removePaper } = profilePaperListSlice.actions;

export default profilePaperListSlice.reducer;
