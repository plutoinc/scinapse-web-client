import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchQueryState {
  query: string;
  isOpenMobileBox: boolean;
}

export const SEARCH_QUERY_INITIAL_STATE: SearchQueryState = {
  query: '',
  isOpenMobileBox: false,
};

const SearchQuerySlice = createSlice({
  name: 'searchQuery',
  initialState: SEARCH_QUERY_INITIAL_STATE,
  reducers: {
    changeSearchQuery(state, action: PayloadAction<{ query: string }>) {
      return { ...state, query: action.payload.query };
    },
    openMobileSearchBox(state) {
      return { ...state, isOpenMobileBox: true };
    },
    closeMobileSearchBox(state) {
      return { ...state, isOpenMobileBox: false };
    },
  },
});

export const { changeSearchQuery, openMobileSearchBox, closeMobileSearchBox } = SearchQuerySlice.actions;

export default SearchQuerySlice.reducer;
