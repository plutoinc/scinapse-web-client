import { Actions, ACTION_TYPES } from '../../actions/actionTypes';

export interface JournalShowState
  extends Readonly<{
      isLoadingJournal: boolean;
      pageErrorCode: number | null;
      isLoadingPapers: boolean;
      failedToLoadPapers: boolean;
      journalId: number;
      paperIds: string[];
      totalPaperCount: number;
      paperTotalPage: number;
      paperCurrentPage: number;
      filteredPaperCount: number;
      searchKeyword?: string;
    }> {}

export const JOURNAL_SHOW_INITIAL_STATE: JournalShowState = {
  isLoadingJournal: false,
  pageErrorCode: null,
  isLoadingPapers: false,
  failedToLoadPapers: false,
  journalId: 0,
  paperTotalPage: 0,
  paperCurrentPage: 0,
  paperIds: [],
  totalPaperCount: 0,
  filteredPaperCount: 0,
  searchKeyword: '',
};

export function reducer(state: JournalShowState = JOURNAL_SHOW_INITIAL_STATE, action: Actions): JournalShowState {
  switch (action.type) {
    case ACTION_TYPES.JOURNAL_SHOW_START_TO_GET_JOURNAL: {
      return { ...state, isLoadingJournal: true, pageErrorCode: null };
    }

    case ACTION_TYPES.JOURNAL_SHOW_SUCCEEDED_TO_GET_JOURNAL: {
      return { ...state, journalId: action.payload.journalId, isLoadingJournal: false };
    }

    case ACTION_TYPES.JOURNAL_SHOW_FAILED_TO_GET_JOURNAL: {
      return { ...state, isLoadingJournal: false, pageErrorCode: action.payload.statusCode };
    }

    case ACTION_TYPES.JOURNAL_SHOW_START_TO_GET_PAPERS: {
      return { ...state, isLoadingPapers: true, failedToLoadPapers: false };
    }

    case ACTION_TYPES.JOURNAL_SHOW_SUCCEEDED_TO_GET_PAPERS: {
      return {
        ...state,
        paperIds: action.payload.paperIds,
        isLoadingPapers: false,
        paperTotalPage: action.payload.totalPage,
        paperCurrentPage: action.payload.currentPage,
        totalPaperCount: action.payload.paperCount,
        filteredPaperCount: action.payload.filteredPaperCount,
        searchKeyword: action.payload.searchKeyword,
      };
    }

    case ACTION_TYPES.JOURNAL_SHOW_FAILED_TO_GET_PAPERS: {
      return { ...state, isLoadingPapers: false, failedToLoadPapers: true };
    }

    default:
      return state;
  }
}
