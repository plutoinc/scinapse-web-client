import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AUTHOR_PAPER_LIST_SORT_TYPES } from '../components/common/sortBox';

export interface ProfilePageState {
  currentPage: number;
  paperIds: string[];
  sort: AUTHOR_PAPER_LIST_SORT_TYPES;
  maxPage: number;
  totalCount: number;
}

interface GetPapersPayload {
  sort: AUTHOR_PAPER_LIST_SORT_TYPES;
  paperIds: string[];
  totalPages: number;
  page: number;
  totalElements: number;
}

export const PROFILE_PAGE_INITIAL_STATE: ProfilePageState = {
  paperIds: [],
  currentPage: 1,
  sort: 'MOST_CITATIONS',
  maxPage: 0,
  totalCount: 0,
};

const profilePageSlice = createSlice({
  name: 'profilePageSlice',
  initialState: PROFILE_PAGE_INITIAL_STATE,
  reducers: {
    getPapers(state, action: PayloadAction<GetPapersPayload>) {
      state.currentPage = action.payload.page;
      state.totalCount = action.payload.totalElements;
      state.maxPage = action.payload.totalPages;
      state.sort = action.payload.sort;
      state.paperIds = action.payload.paperIds;
    },
  },
});

export const { getPapers } = profilePageSlice.actions;

export default profilePageSlice.reducer;
