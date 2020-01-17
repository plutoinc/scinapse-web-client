import { ACTION_TYPES, Actions } from '../../actions/actionTypes';
import { PAPER_SHOW_INITIAL_STATE, PaperShowState } from './records';

export function reducer(state: PaperShowState = PAPER_SHOW_INITIAL_STATE, action: Actions): PaperShowState {
  switch (action.type) {
    case ACTION_TYPES.PAPER_SHOW_SET_HIGHLIGHT: {
      return { ...state, highlightTitle: action.payload.title, highlightAbstract: action.payload.abstract };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_PAPER: {
      return { ...state, ...{ errorStatusCode: null, isLoadingPaper: false, paperId: action.payload.paperId } };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_PAPER: {
      return { ...state, ...{ errorStatusCode: null, isLoadingPaper: true } };
    }

    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_PAPER: {
      return { ...state, ...{ errorStatusCode: action.payload.statusCode, isLoadingPaper: false, paperId: '' } };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS: {
      return { ...state, ...{ isLoadingReferencePapers: true, isFailedToGetReferencePapers: false } };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_REFERENCE_PAPERS: {
      return {
        ...state,
        ...{
          isLoadingReferencePapers: false,
          isFailedToGetReferencePapers: false,
          referencePaperTotalPage: action.payload.totalPages,
          referencePaperCurrentPage: action.payload.page,
          referencePaperIds: action.payload.paperIds,
        },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_REFERENCE_PAPERS: {
      return { ...state, isLoadingReferencePapers: false, isFailedToGetReferencePapers: true };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_CITED_PAPERS: {
      return { ...state, isLoadingCitedPapers: true, isFailedToGetCitedPapers: false };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_CITED_PAPERS: {
      return {
        ...state,
        ...{
          isLoadingCitedPapers: false,
          isFailedToGetCitedPapers: false,
          citedPaperTotalPage: action.payload.totalPages,
          citedPaperCurrentPage: action.payload.page,
          citedPaperIds: action.payload.paperIds,
        },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_CITED_PAPERS: {
      return { ...state, ...{ isLoadingCitedPapers: false, isFailedToGetCitedPapers: true } };
    }

    case ACTION_TYPES.PAPER_SHOW_CLEAR_PAPER_SHOW_STATE: {
      return PAPER_SHOW_INITIAL_STATE;
    }

    default:
      return state;
  }
}
