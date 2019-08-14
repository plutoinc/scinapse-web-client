import { uniq, uniqBy } from 'lodash';
import { AggregationData } from '../model/aggregation';
import { ACTION_TYPES, SearchActions } from '../actions/actionTypes';
import { FILTER_BUTTON_TYPE } from '../components/filterButton';
import { JournalSuggestion } from '../api/completion';
import { toggleElementFromArray } from '../helpers/toggleElementFromArray';

export interface SearchFilterState extends AggregationData {
  activeButton: FILTER_BUTTON_TYPE | null;
  currentYearFrom: number | string;
  currentYearTo: number | string;
  selectedJournalIds: number[];
  selectedFOSIds: number[];
  detectedYear: number | null;
  addedJournals: JournalSuggestion[];
  sorting: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS;
  enableAutoYearFilter: boolean;
}

export const SEARCH_FILTER_INITIAL_STATE: SearchFilterState = {
  activeButton: null,
  currentYearFrom: '',
  currentYearTo: '',
  selectedJournalIds: [],
  selectedFOSIds: [],
  sorting: 'RELEVANCE',
  detectedYear: null,
  enableAutoYearFilter: true,
  // data
  fosList: [],
  journals: [],
  yearAll: [],
  yearFiltered: [],
  addedJournals: [],
};

export function reducer(state = SEARCH_FILTER_INITIAL_STATE, action: SearchActions) {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS: {
      const { data } = action.payload;

      if (!data.aggregation) return state;

      return {
        ...state,
        ...data.aggregation,
        detectedYear: data.detectedYear,
        enableAutoYearFilter: true,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SET_ACTIVE_FILTER_BOX_BUTTON: {
      return {
        ...state,
        activeButton: action.payload.button,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_DISABLE_AUTO_YEAR_FILTER: {
      return {
        ...state,
        enableAutoYearFilter: false,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SYNC_FILTERS_WITH_QUERY_PARAMS: {
      const { filters, sorting } = action.payload;

      return {
        ...state,
        currentYearFrom: filters.yearFrom,
        currentYearTo: filters.yearTo,
        selectedJournalIds: filters.journal,
        selectedFOSIds: filters.fos,
        sorting,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SELECT_JOURNAL_FILTER_ITEM: {
      return {
        ...state,
        selectedJournalIds: toggleElementFromArray(action.payload.journalId, state.selectedJournalIds),
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SELECT_FOS_FILTER_ITEM: {
      return {
        ...state,
        selectedFOSIds: toggleElementFromArray(action.payload.FOSId, state.selectedFOSIds),
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_CLEAR_JOURNAL_FILTER: {
      return {
        ...state,
        selectedJournalIds: [],
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_CLEAR_FOS_FILTER: {
      return {
        ...state,
        selectedFOSIds: [],
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_ADD_JOURNAL_FILTER_ITEMS: {
      const journalIds = action.payload.journals.map(j => j.id);

      return {
        ...state,
        selectedJournalIds: uniq([...journalIds, ...state.selectedJournalIds]),
        journals: uniqBy([...action.payload.journals, ...state.journals], j => j.id),
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_ADD_FOS_FILTER_ITEMS: {
      const FOSIds = action.payload.FOSList.map(FOS => FOS.id);

      return {
        ...state,
        selectedFOSIds: uniq([...FOSIds, ...state.selectedFOSIds]),
        fosList: uniqBy([...action.payload.FOSList, ...state.fosList], FOS => FOS.id),
      };
    }

    default:
      return state;
  }
}
