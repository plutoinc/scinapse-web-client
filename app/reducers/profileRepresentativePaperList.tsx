import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProfileRepresentativePaperListState {
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

export const PROFILE_REPRESENTATIVE_PAPER_LIST_INITIAL_STATE: ProfileRepresentativePaperListState = {
  paperIds: [],
  currentPage: 0,
  maxPage: 0,
  totalCount: 0,
};

const profileRepresentativePaperListSlice = createSlice({
  name: 'profileRepresentativePaperListSlice',
  initialState: PROFILE_REPRESENTATIVE_PAPER_LIST_INITIAL_STATE,
  reducers: {
    getRepresentativePapers(state, action: PayloadAction<GetPapersPayload>) {
      state.currentPage = action.payload.page;
      state.totalCount = action.payload.totalElements;
      state.maxPage = action.payload.totalPages;
      state.paperIds = action.payload.paperIds;
    },
    addRepresentativePaper(state, action: PayloadAction<{ paperId: string }>) {
      state.totalCount = state.totalCount + 1;
      state.paperIds = [action.payload.paperId, ...state.paperIds];
    },
    removeRepresentativePaper(state, action: PayloadAction<{ paperId: string }>) {
      state.totalCount = state.totalCount - 1;
      const prevPaperIds = state.paperIds;
      const nextPaperIds = prevPaperIds.filter(paperId => paperId !== action.payload.paperId);

      state.paperIds = nextPaperIds;
    },
  },
});

export const {
  getRepresentativePapers,
  addRepresentativePaper,
  removeRepresentativePaper,
} = profileRepresentativePaperListSlice.actions;

export default profileRepresentativePaperListSlice.reducer;
