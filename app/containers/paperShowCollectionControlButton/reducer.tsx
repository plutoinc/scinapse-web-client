import { ACTION_TYPES, Actions } from '../../actions/actionTypes';

export interface MyCollectionsState
  extends Readonly<{
      isFetchingPaper: boolean;
      isFetchingMemo: boolean;
      collectionIds: string[];
      isLoadingCollections: boolean;
      isLoadingCollectionsInDropdown: boolean;
      isPositingNewCollection: boolean;
      hasFailedToPositingNewCollection: boolean;
      selectedCollectionId: string;
      isCollectionDropdownOpen: boolean;
      isNoteDropdownOpen: boolean;
      isPostingNote: boolean;
      isNoteEditMode: boolean;
    }> {}

export const MY_COLLECTIONS_INITIAL_STATE: MyCollectionsState = {
  isFetchingPaper: false,
  isFetchingMemo: false,
  isLoadingCollections: false,
  isLoadingCollectionsInDropdown: false,
  isPositingNewCollection: false,
  hasFailedToPositingNewCollection: false,
  collectionIds: [],
  selectedCollectionId: "",
  isCollectionDropdownOpen: false,
  isNoteDropdownOpen: false,
  isPostingNote: false,
  isNoteEditMode: false,
};

export function reducer(state: MyCollectionsState = MY_COLLECTIONS_INITIAL_STATE, action: Actions): MyCollectionsState {
  switch (action.type) {
    case ACTION_TYPES.COLLECTIONS_START_TO_GET_COLLECTIONS: {
      return { ...state, isLoadingCollections: true };
    }

    case ACTION_TYPES.COLLECTIONS_SUCCEEDED_GET_COLLECTIONS: {
      return {
        ...state,
        isLoadingCollections: false,
      };
    }

    case ACTION_TYPES.COLLECTIONS_FAILED_TO_GET_COLLECTIONS: {
      return { ...state, isLoadingCollections: false };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_REMOVE_PAPER_FROM_COLLECTION:
    case ACTION_TYPES.PAPER_SHOW_START_TO_POST_PAPER_TO_COLLECTION: {
      return { ...state, isFetchingPaper: true };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_REMOVE_PAPER_FROM_COLLECTION:
    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_REMOVE_PAPER_FROM_COLLECTION:
    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_POST_PAPER_TO_COLLECTION:
    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_POST_PAPER_TO_COLLECTION: {
      return { ...state, isFetchingPaper: false };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_COLLECTIONS: {
      return { ...state, isLoadingCollections: true };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_COLLECTIONS_IN_DROPDOWN: {
      return { ...state, isLoadingCollectionsInDropdown: true };
    }

    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_COLLECTIONS: {
      return { ...state, isLoadingCollections: false, isLoadingCollectionsInDropdown: false };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_GET_COLLECTIONS: {
      return {
        ...state,
        collectionIds: action.payload.result,
        isLoadingCollections: false,
        isLoadingCollectionsInDropdown: false,
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_POST_COLLECTION: {
      return {
        ...state,
        isPositingNewCollection: false,
        hasFailedToPositingNewCollection: false,
        collectionIds: [...[action.payload.collectionId], ...state.collectionIds],
        selectedCollectionId: action.payload.collectionId,
      };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_START_TO_POST_COLLECTION: {
      return { ...state, isPositingNewCollection: true, hasFailedToPositingNewCollection: false };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_POST_COLLECTION: {
      return { ...state, isPositingNewCollection: false, hasFailedToPositingNewCollection: true };
    }

    case ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_SELECT_COLLECTION: {
      return { ...state, selectedCollectionId: action.payload.collection.id };
    }

    case ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_OPEN_COLLECTION_DROPDOWN: {
      return { ...state, isCollectionDropdownOpen: true };
    }

    case ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_CLOSE_COLLECTION_DROPDOWN: {
      return { ...state, isCollectionDropdownOpen: false };
    }

    case ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_OPEN_NOTE_DROPDOWN: {
      return { ...state, isNoteDropdownOpen: true };
    }

    case ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_CLOSE_NOTE_DROPDOWN: {
      return { ...state, isNoteDropdownOpen: false, isNoteEditMode: false };
    }

    case ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_TOGGLE_NOTE_EDIT_MODE: {
      return { ...state, isNoteEditMode: !state.isNoteEditMode };
    }

    case ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_START_TO_UPDATE_PAPER_NOTE: {
      return { ...state, isPostingNote: true };
    }
    case ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_FAILED_TO_UPDATE_PAPER_NOTE:
    case ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_SUCCEEDED_TO_UPDATE_PAPER_NOTE: {
      return { ...state, isPostingNote: false };
    }

    case ACTION_TYPES.COLLECTIONS_SUCCEEDED_GET_MEMBER_COLLECTIONS: {
      return { ...state, collectionIds: action.payload.result, isLoadingCollections: false };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_GET_COLLECTIONS: {
      return { ...state, collectionIds: action.payload.collectionIds };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_DELETE_COLLECTION: {
      const targetCollectionId = action.payload.collectionId;
      const index = state.collectionIds.indexOf(targetCollectionId);

      if (index > -1) {
        const newCollectionIds = [...state.collectionIds.slice(0, index), ...state.collectionIds.slice(index + 1)];
        return { ...state, collectionIds: newCollectionIds };
      }

      return state;
    }

    case ACTION_TYPES.AUTH_SUCCEEDED_TO_SIGN_OUT: {
      return MY_COLLECTIONS_INITIAL_STATE;
    }

    default:
      return state;
  }
}
