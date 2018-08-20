import { Actions, ACTION_TYPES } from "../../actions/actionTypes";

export interface JournalShowState
  extends Readonly<{
      isLoadingJournal: boolean;
      failedToLoadJournal: boolean;
      isLoadingPapers: boolean;
      failedToLoadPapers: boolean;
      journalId: number;
      paperIds: number[];
      paperTotalPage: number;
      paperCurrentPage: number;
    }> {}

export const JOURNAL_SHOW_INITIAL_STATE: JournalShowState = {
  isLoadingJournal: false,
  failedToLoadJournal: false,
  isLoadingPapers: false,
  failedToLoadPapers: false,
  journalId: 0,
  paperTotalPage: 0,
  paperCurrentPage: 0,
  paperIds: [],
};

export function reducer(state: JournalShowState = JOURNAL_SHOW_INITIAL_STATE, action: Actions): JournalShowState {
  switch (action.type) {
    case ACTION_TYPES.JOURNAL_SHOW_START_TO_GET_JOURNAL: {
      return { ...state, isLoadingJournal: true, failedToLoadJournal: false };
    }

    case ACTION_TYPES.JOURNAL_SHOW_SUCCEEDED_TO_GET_JOURNAL: {
      return { ...state, journalId: action.payload.journalId, isLoadingJournal: false };
    }

    case ACTION_TYPES.JOURNAL_SHOW_FAILED_TO_GET_JOURNAL: {
      return { ...state, isLoadingJournal: false, failedToLoadJournal: true };
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
      };
    }

    case ACTION_TYPES.JOURNAL_SHOW_FAILED_TO_GET_PAPERS: {
      return { ...state, isLoadingPapers: false, failedToLoadPapers: true };
    }

    default:
      return state;
  }
}
