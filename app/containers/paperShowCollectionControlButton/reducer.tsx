import { ACTION_TYPES, Actions } from "../../actions/actionTypes";

export interface MyCollectionsState
  extends Readonly<{
      isFetchingPaper: boolean;
      isFetchingMemo: boolean;
      collectionIds: number[];
      isLoadingCollections: boolean;
      isPositingNewCollection: boolean;
      hasFailedToPositingNewCollection: boolean;
      selectedCollectionId: number;
    }> {}

export const MY_COLLECTIONS_INITIAL_STATE: MyCollectionsState = {
  isFetchingPaper: false,
  isFetchingMemo: false,
  isLoadingCollections: false,
  isPositingNewCollection: false,
  hasFailedToPositingNewCollection: false,
  collectionIds: [],
  selectedCollectionId: 0,
};

export function reducer(state: MyCollectionsState = MY_COLLECTIONS_INITIAL_STATE, action: Actions): MyCollectionsState {
  switch (action.type) {
    case ACTION_TYPES.PAPER_SHOW_START_TO_POST_PAPER_TO_COLLECTION: {
      return {
        ...state,
        isFetchingPaper: true,
      };
    }

    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_POST_PAPER_TO_COLLECTION:
    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_POST_PAPER_TO_COLLECTION: {
      return {
        ...state,
        isFetchingPaper: false,
      };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_COLLECTIONS: {
      return {
        ...state,
        isLoadingCollections: true,
      };
    }

    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_COLLECTIONS: {
      return {
        ...state,
        isLoadingCollections: false,
      };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_GET_COLLECTIONS: {
      return {
        ...state,
        collectionIds: action.payload.collectionIds,
        isLoadingCollections: false,
      };
    }
    case ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_POST_COLLECTION: {
      return {
        ...state,
        isPositingNewCollection: false,
        hasFailedToPositingNewCollection: false,
        collectionIds: [...[action.payload.collectionId], ...state.collectionIds],
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_START_TO_POST_COLLECTION: {
      return {
        ...state,
        isPositingNewCollection: true,
        hasFailedToPositingNewCollection: false,
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_POST_COLLECTION: {
      return {
        ...state,
        isPositingNewCollection: false,
        hasFailedToPositingNewCollection: true,
      };
    }

    case ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_SELECT_COLLECTION: {
      return {
        ...state,
        selectedCollectionId: action.payload.collection.id,
      };
    }

    default:
      return state;
  }
}
