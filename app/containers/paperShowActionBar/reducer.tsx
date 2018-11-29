import { ACTION_TYPES, Actions } from "../../actions/actionTypes";

export interface PaperShowActionBarState
  extends Readonly<{
      isLoadingMyCollections: boolean;
      isPositingNewCollection: boolean;
      hasFailedToLoadMyCollections: boolean;
      hasFailedToPositingNewCollection: boolean;
      isCollectionDropdownOpen: boolean;
      myCollectionIds: number[];
    }> {}

export const PAPER_SHOW_ACTION_BAR_INITIAL_STATE: PaperShowActionBarState = {
  isLoadingMyCollections: false,
  isPositingNewCollection: false,
  hasFailedToLoadMyCollections: false,
  hasFailedToPositingNewCollection: false,
  isCollectionDropdownOpen: false,
  myCollectionIds: [],
};

export function reducer(
  state: PaperShowActionBarState = PAPER_SHOW_ACTION_BAR_INITIAL_STATE,
  action: Actions
): PaperShowActionBarState {
  switch (action.type) {
    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_COLLECTIONS: {
      return {
        ...state,
        isLoadingMyCollections: true,
        hasFailedToLoadMyCollections: false,
      };
    }

    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_COLLECTIONS: {
      return {
        ...state,
        isLoadingMyCollections: false,
        hasFailedToLoadMyCollections: true,
      };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_GET_COLLECTIONS: {
      return {
        ...state,
        myCollectionIds: action.payload.collectionIds,
        isLoadingMyCollections: false,
        hasFailedToLoadMyCollections: false,
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_START_TO_POST_COLLECTION: {
      return {
        ...state,
        isPositingNewCollection: true,
        hasFailedToPositingNewCollection: false,
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_POST_COLLECTION: {
      return {
        ...state,
        isPositingNewCollection: false,
        hasFailedToPositingNewCollection: false,
        myCollectionIds: [...[action.payload.collectionId], ...state.myCollectionIds],
      };
    }
    case ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_POST_COLLECTION: {
      return {
        ...state,
        isPositingNewCollection: false,
        hasFailedToPositingNewCollection: true,
      };
    }

    case ACTION_TYPES.PAPER_SHOW_ACTION_BAR_OPEN_COLLECTION_DROPDOWN: {
      return { ...state, isCollectionDropdownOpen: true };
    }

    case ACTION_TYPES.PAPER_SHOW_ACTION_BAR_CLOSE_COLLECTION_DROPDOWN: {
      return { ...state, isCollectionDropdownOpen: false };
    }

    default:
      return state;
  }
}
