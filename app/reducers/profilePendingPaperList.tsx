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
  isLoading: boolean;
  papers: PendingPaper[];
}

export const PROFILE_PENDING_PAPER_LIST_INITIAL_STATE: ProfilePendingPaperListState = {
  isLoading: false,
  papers: [],
};

const profilePendingPaperListSlice = createSlice({
  name: 'profilePendingPaperListSlice',
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
    markTryAgainPendingPaper(state, action: PayloadAction<{ paperId: string }>) {
      const targetIndex = state.papers.findIndex(paper => paper.id === action.payload.paperId);

      state.papers = [
        ...state.papers.slice(0, targetIndex),
        { ...state.papers[targetIndex], tryAgain: true },
        ...state.papers.slice(targetIndex + 1),
      ];
    },
    changeLoadingStatus(state, action: PayloadAction<{ isLoading: boolean }>) {
      state.isLoading = action.payload.isLoading;
    },
  },
});

export const {
  getPendingPapers,
  removePendingPaper,
  markTryAgainPendingPaper,
  changeLoadingStatus,
} = profilePendingPaperListSlice.actions;

export default profilePendingPaperListSlice.reducer;
