import { ACTION_TYPES, Actions } from '../../actions/actionTypes';
import { AUTHOR_PAPER_LIST_SORT_TYPES } from '../../components/common/sortBox';
import { toggleElementFromArray } from '../../helpers/toggleElementFromArray';

export interface CollectionShowState
  extends Readonly<{
      isLoadingCollection: boolean;
      pageErrorCode: number | null;
      isLoadingPaperToCollection: boolean;
      mainCollectionId: number;
      totalPaperListPage: number;
      currentPaperListPage: number;
      papersTotalCount: number;
      sortType: AUTHOR_PAPER_LIST_SORT_TYPES;
      searchKeyword: string;
      paperIds: number | number[];
      selectedPaperIds: number[];
    }> {}

export const INITIAL_COLLECTION_SHOW_STATE: CollectionShowState = {
  isLoadingCollection: false,
  pageErrorCode: null,
  isLoadingPaperToCollection: false,
  mainCollectionId: 0,
  totalPaperListPage: 0,
  currentPaperListPage: 1,
  papersTotalCount: 0,
  sortType: 'RECENTLY_ADDED',
  searchKeyword: '',
  paperIds: [],
  selectedPaperIds: [],
};

export function reducer(
  state: CollectionShowState = INITIAL_COLLECTION_SHOW_STATE,
  action: Actions
): CollectionShowState {
  switch (action.type) {
    case ACTION_TYPES.COLLECTION_SHOW_START_TO_GET_COLLECTION: {
      return {
        ...state,
        isLoadingCollection: true,
        pageErrorCode: null,
      };
    }

    case ACTION_TYPES.COLLECTION_SHOW_SUCCEEDED_GET_COLLECTION: {
      return {
        ...state,
        isLoadingCollection: false,
        mainCollectionId: action.payload.collectionId,
      };
    }

    case ACTION_TYPES.COLLECTION_SHOW_FAILED_TO_GET_COLLECTION: {
      return {
        ...state,
        isLoadingCollection: false,
        pageErrorCode: action.payload.statusCode,
      };
    }
    case ACTION_TYPES.COLLECTION_SHOW_START_TO_GET_PAPERS: {
      return {
        ...state,
        isLoadingPaperToCollection: true,
      };
    }
    case ACTION_TYPES.COLLECTION_SHOW_FAILED_TO_GET_PAPERS: {
      return {
        ...state,
        isLoadingPaperToCollection: false,
      };
    }

    case ACTION_TYPES.COLLECTION_SHOW_SUCCEEDED_GET_PAPERS: {
      const pageRes = action.payload.paperResponse.page;
      const paperIds = action.payload.paperResponse.result;

      return pageRes
        ? {
            ...state,
            isLoadingPaperToCollection: false,
            paperIds,
            sortType: action.payload.sort as AUTHOR_PAPER_LIST_SORT_TYPES,
            totalPaperListPage: pageRes.totalPages,
            currentPaperListPage: pageRes.page,
            papersTotalCount: pageRes.totalElements,
            searchKeyword: action.payload.query ? action.payload.query : '',
          }
        : { ...state, isLoadingPaperToCollection: false, paperIds };
    }

    case ACTION_TYPES.GLOBAL_FAILED_TO_ADD_PAPER_TO_COLLECTION:
    case ACTION_TYPES.GLOBAL_START_TO_REMOVE_PAPER_FROM_COLLECTION: {
      if (action.payload.collection.id === state.mainCollectionId) {
        const removePaperIds = action.payload.paperIds;
        if (typeof state.paperIds === 'object') {
          let newPaperIds = [...state.paperIds];

          removePaperIds.forEach(removePaperId => {
            const paperIndex = newPaperIds.indexOf(removePaperId);
            const paperIdsLength = newPaperIds.length;

            newPaperIds = [...newPaperIds.slice(0, paperIndex), ...newPaperIds.slice(paperIndex + 1, paperIdsLength)];
          });

          return {
            ...state,
            paperIds: newPaperIds,
            papersTotalCount: newPaperIds.length,
          };
        } else {
          return {
            ...state,
            paperIds: [],
            papersTotalCount: 0,
          };
        }
      }
      return state;
    }

    case ACTION_TYPES.COLLECTION_SHOW_SELECT_PAPER_ITEM: {
      return {
        ...state,
        selectedPaperIds: toggleElementFromArray(action.payload.paperId, state.selectedPaperIds),
      };
    }

    case ACTION_TYPES.COLLECTION_SHOW_SELECT_ALL_PAPER_ITEMS: {
      if (state.selectedPaperIds.length > 0) {
        return {
          ...state,
          selectedPaperIds: [],
        };
      }

      return {
        ...state,
        selectedPaperIds: action.payload.paperIds,
      };
    }

    default:
      return state;
  }
}
