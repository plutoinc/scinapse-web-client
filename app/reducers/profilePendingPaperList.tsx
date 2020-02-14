import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PendingPaper {
  id: number;
  paperId: null;
  title: string;
  author: string;
  journal: string;
  year: number;
  tryAgain: boolean;
}

export interface ProfilePendingPaperListState {
  papers: PendingPaper[];
}

export const PROFILE_PENDING_PAPER_LIST_INITIAL_STATE: ProfilePendingPaperListState = {
  papers: [],
};

const profilePendingPaperListSlice = createSlice({
  name: 'profilePageSlice',
  initialState: PROFILE_PENDING_PAPER_LIST_INITIAL_STATE,
  reducers: {
    getPendingPapers(state, action: PayloadAction<{ papers: PendingPaper[] }>) {
      state.papers = action.payload.papers;
    },
  },
});

export const { getPendingPapers } = profilePendingPaperListSlice.actions;

export default profilePendingPaperListSlice.reducer;
