import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { remove } from 'lodash';

export interface PendingPaper {
  id: string;
  paperId: string;
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
    removePendingPaper(state, action: PayloadAction<{ paperId: string }>) {
      const prevPapers = state.papers;
      const nextPapers = remove(prevPapers, paper => paper.id !== action.payload.paperId);

      state.papers = nextPapers;
    },
  },
});

export const { getPendingPapers, removePendingPaper } = profilePendingPaperListSlice.actions;

export default profilePendingPaperListSlice.reducer;
