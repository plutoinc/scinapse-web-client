import { ACTION_TYPES, Actions } from "../../actions/actionTypes";
import { PAPER_LIST_SORT_TYPES } from "../common/sortBox";

export interface CollectionShowState
  extends Readonly<{
      isLoadingCollection: boolean;
      failedToLoadingCollection: boolean;
      mainCollectionId: number;
      sortType: PAPER_LIST_SORT_TYPES;
    }> {}

export const INITIAL_COLLECTION_SHOW_STATE: CollectionShowState = {
  isLoadingCollection: false,
  failedToLoadingCollection: false,
  mainCollectionId: 0,
  sortType: "MOST_CITATIONS"
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
        failedToLoadingCollection: false
      };
    }

    case ACTION_TYPES.COLLECTION_SHOW_SUCCEEDED_GET_COLLECTION: {
      return {
        ...state,
        isLoadingCollection: false,
        mainCollectionId: action.payload.collectionId
      };
    }

    case ACTION_TYPES.COLLECTION_SHOW_FAILED_TO_GET_COLLECTION: {
      return {
        ...state,
        isLoadingCollection: false,
        failedToLoadingCollection: true
      };
    }

    default:
      return state;
  }
}
